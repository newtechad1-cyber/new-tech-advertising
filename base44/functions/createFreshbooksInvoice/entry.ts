import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    const { request_id, clientid, selected_tasks, selected_audits, selected_subscriptions, manual_lines, due_date, notes } = payload;

    if (!request_id) return Response.json({ error: "request_id is required" }, { status: 400 });

    // 1. Atomic Reservation / Idempotency Check
    let transaction;
    try {
      // Attempt to create first to reserve the unique request_id
      transaction = await base44.asServiceRole.entities.BillingTransaction.create({
        request_id,
        app_user_id: user.id,
        client_id: String(clientid),
        status: "pending",
        calculated_subtotal: 0,
        calculated_tax: 0,
        calculated_total: 0
      });
    } catch (e) {
      // If creation fails (e.g., unique constraint violation), load existing
      const existingTxList = await base44.asServiceRole.entities.BillingTransaction.filter({ request_id });
      transaction = existingTxList[0];
      if (!transaction) throw new Error("Failed to reserve transaction ID: " + e.message);
    }
    
    if (transaction.status === 'completed') {
      return Response.json({ status: 'completed', invoice_id: transaction.freshbooks_invoice_id, invoice_number: transaction.freshbooks_invoice_number });
    }
    if (['freshbooks_created', 'recovery_required', 'updating_sources'].includes(transaction.status)) {
       return Response.json({ status: 'recovery_required', invoice_id: transaction.freshbooks_invoice_id, invoice_number: transaction.freshbooks_invoice_number });
    }
    if (transaction.status === 'creating') {
       return Response.json({ error: 'Concurrent request in progress' }, { status: 409 });
    }

    // 2. Fetch FreshBooks Connection
    const connectorId = "6a5803ed18a980baf5370db9";
    let accessToken, accountId, businessId;
    try {
      const conn = await base44.connectors.getConnection(connectorId);
      accessToken = conn.access_token;
      
      const meRes = await fetch("https://api.freshbooks.com/auth/api/v1/users/me", {
        headers: { "Authorization": `Bearer ${accessToken}`, "Api-Version": "alpha", "Accept": "application/json" }
      });
      if (!meRes.ok) throw new Error("Failed to fetch FreshBooks identity");
      const meData = await meRes.json();
      const membership = meData.response?.business_memberships?.[0];
      if (!membership) throw new Error("No business membership found.");
      accountId = membership.business.account_id;
      businessId = membership.business.id;
    } catch (e) {
      return Response.json({ error: "FreshBooks connection error: " + e.message }, { status: 400 });
    }

    // 3. Validate Source Records & Build Lines (Strict Organization & Status Checks)
    let subtotalCents = 0;
    let taxCents = 0;
    const source_items = [];
    const lines = [];

    for (const tid of (selected_tasks || [])) {
      const t = await base44.asServiceRole.entities.NTATask.get(tid);
      if (!t) throw new Error(`Task ${tid} not found`);
      if (String(t.company_id) !== String(clientid)) throw new Error(`Task ${tid} belongs to a different client organization`);
      if (t.billing_status !== 'unbilled') throw new Error(`Task ${tid} status is not unbilled`);
      
      source_items.push({ type: 'NTATask', id: tid });
      lines.push({ type: { code: 0 }, name: "Marketing Task", description: t.title + (t.description ? ` - ${t.description}` : ''), qty: "1", unit_cost: { amount: "0.00", code: "USD" }});
    }

    for (const aid of (selected_audits || [])) {
      const a = await base44.asServiceRole.entities.GapAudit.get(aid);
      if (!a) throw new Error(`Audit ${aid} not found`);
      if (String(a.client_id) !== String(clientid)) throw new Error(`Audit ${aid} belongs to a different client organization`);
      if (a.billing_status !== 'unbilled') throw new Error(`Audit ${aid} status is not unbilled`);
      
      source_items.push({ type: 'GapAudit', id: aid });
      lines.push({ type: { code: 0 }, name: "Gap Audit", description: `Website Gap Audit for ${a.business_name || a.website_url}`, qty: "1", unit_cost: { amount: "199.00", code: "USD" }});
      subtotalCents += 19900;
    }

    for (const sid of (selected_subscriptions || [])) {
      const s = await base44.asServiceRole.entities.ClientSubscriptions.get(sid);
      if (!s) throw new Error(`Subscription ${sid} not found`);
      if (String(s.company_id) !== String(clientid)) throw new Error(`Subscription ${sid} belongs to a different client organization`);
      if (s.billing_status !== 'unbilled') throw new Error(`Subscription ${sid} status is not unbilled`);
      
      source_items.push({ type: 'ClientSubscriptions', id: sid });
      const amtCents = Math.round(Number(s.amount || 0) * 100);
      lines.push({ type: { code: 0 }, name: "Recurring Service", description: `${s.plan_name || 'Service Plan'} (${s.billing_interval})`, qty: "1", unit_cost: { amount: (amtCents / 100).toFixed(2), code: "USD" }});
      subtotalCents += amtCents;
    }

    for (const m of (manual_lines || [])) {
      if (!m.name) continue;
      const qty = Number(m.qty || 1);
      const rateCents = Math.round(Number(m.rate || 0) * 100);
      if (isNaN(qty) || isNaN(rateCents) || qty < 0 || rateCents < 0) throw new Error("Invalid manual line values");
      
      const lineTotalCents = Math.round(qty * rateCents);
      subtotalCents += lineTotalCents;
      
      const line: any = { type: { code: 0 }, name: m.name, description: m.description || "", qty: String(qty), unit_cost: { amount: (rateCents / 100).toFixed(2), code: "USD" }};
      
      if (m.taxName1 && m.taxAmount1) {
        const taxBasisPoints = Math.round(Number(m.taxAmount1) * 100); // e.g. 5.5% -> 550
        if (isNaN(taxBasisPoints) || taxBasisPoints < 0) throw new Error("Invalid tax value");
        line.taxName1 = m.taxName1;
        line.taxAmount1 = String(Number(m.taxAmount1));
        taxCents += Math.round((lineTotalCents * taxBasisPoints) / 10000);
      }
      lines.push(line);
    }

    const uniqueIds = new Set(source_items.map(s => s.id));
    if (uniqueIds.size !== source_items.length) throw new Error("Duplicate source items provided");
    if (lines.length === 0) throw new Error("No line items to invoice");

    const totalCents = subtotalCents + taxCents;
    const invoicePayload: any = {
      customerid: parseInt(clientid),
      create_date: new Date().toISOString().split('T')[0],
      status: 1, // DRAFT STATUS ENFORCED
      due_offset_days: 14,
      notes: notes || "",
      lines: lines
    };
    if (due_date) invoicePayload.due_date = due_date;

    // Update transaction from pending to creating with safe snapshot
    transaction = await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, {
      freshbooks_business_id: String(businessId),
      freshbooks_account_id: String(accountId),
      source_items,
      invoice_payload_snapshot: JSON.stringify(invoicePayload),
      calculated_subtotal: subtotalCents,
      calculated_tax: taxCents,
      calculated_total: totalCents,
      status: "creating"
    });
    await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "transaction_creating", freshbooks_business_id: String(businessId), details: "Transaction prepared and reserved" });

    // 4. Call FreshBooks API Boundary
    const fbRes = await fetch(`https://api.freshbooks.com/accounting/account/${accountId}/invoices/invoices`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Accept": "application/json", "Api-Version": "alpha", "Content-Type": "application/json" },
      body: JSON.stringify({ invoice: invoicePayload })
    });

    if (!fbRes.ok) {
       const errTxt = await fbRes.text();
       await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, { status: "failed", error_stage: "freshbooks_api", error_message: errTxt });
       await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "freshbooks_api_failed", details: "Failed at FreshBooks API" });
       throw new Error("FreshBooks API Error. See logs.");
    }

    const fbData = await fbRes.json();
    const invoiceData = fbData.response?.result?.invoice || fbData.response?.invoice || fbData.invoice;
    if (!invoiceData || !invoiceData.id) throw new Error("FreshBooks did not return an invoice ID");

    const fbId = String(invoiceData.id);
    const fbNumber = String(invoiceData.invoice_number || fbId);

    // 5. Persist FreshBooks Result Immediately
    await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, {
       status: "freshbooks_created",
       freshbooks_invoice_id: fbId,
       freshbooks_invoice_number: fbNumber
    });
    await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "freshbooks_invoice_created", freshbooks_invoice_id: fbId, details: `Invoice ${fbNumber} created` });
    transaction.freshbooks_invoice_id = fbId;
    transaction.freshbooks_invoice_number = fbNumber;

    // 6. Update Source Records Safe Loop
    await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, { status: "updating_sources" });
    
    let hasError = false;
    for (const item of source_items) {
       try {
          const rec = await base44.asServiceRole.entities[item.type].get(item.id);
          if (rec.billing_status === 'unbilled') {
             await base44.asServiceRole.entities[item.type].update(item.id, {
                billing_status: "billed",
                freshbooks_invoice_id: fbId,
                freshbooks_invoice_number: fbNumber,
                billed_date: new Date().toISOString(),
                billing_transaction_id: transaction.id
             });
             await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "source_updated_success", details: `${item.type} ${item.id}` });
          } else {
             throw new Error(`State changed unexpectedly for ${item.type} ${item.id}`);
          }
       } catch (e) {
          hasError = true;
          await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, { status: "recovery_required", error_stage: `update_source_${item.id}`, error_message: e.message });
          await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "source_updated_failed", details: `${item.type} ${item.id}: ${e.message}` });
          break;
       }
    }

    if (hasError) {
       return Response.json({ status: "recovery_required", invoice_id: fbId, invoice_number: fbNumber, error: "Partial failure during source record updates." });
    }

    await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, { status: "completed", completed_date: new Date().toISOString() });
    await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, client_id: String(clientid), action: "transaction_completed", details: "All sources updated" });

    return Response.json({ status: "completed", invoice_id: fbId, invoice_number: fbNumber });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});