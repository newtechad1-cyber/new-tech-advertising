import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { request_id } = await req.json().catch(() => ({}));
    if (!request_id) return Response.json({ error: "request_id required" }, { status: 400 });

    const txList = await base44.asServiceRole.entities.BillingTransaction.filter({ request_id });
    const transaction = txList[0];
    if (!transaction) return Response.json({ error: "Transaction not found" }, { status: 404 });
    
    if (transaction.app_user_id !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

    if (transaction.status === 'completed') {
       return Response.json({ status: 'completed', invoice_number: transaction.freshbooks_invoice_number });
    }
    
    if (!transaction.freshbooks_invoice_id) {
       return Response.json({ error: "Cannot recover: FreshBooks invoice ID is missing." }, { status: 400 });
    }

    const connectorId = "6a5803ed18a980baf5370db9";
    const conn = await base44.connectors.getConnection(connectorId);
    const meRes = await fetch("https://api.freshbooks.com/auth/api/v1/users/me", { headers: { "Authorization": `Bearer ${conn.access_token}`, "Api-Version": "alpha", "Accept": "application/json" }});
    const meData = await meRes.json();
    const membership = meData.response?.business_memberships?.[0];
    if (!membership || String(membership.business.id) !== transaction.freshbooks_business_id) {
       throw new Error("Connected FreshBooks account does not match the transaction's business.");
    }

    await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, action: "recovery_started", details: "Attempting to resume source updates" });

    let hasError = false;
    for (const item of transaction.source_items || []) {
       try {
          const rec = await base44.asServiceRole.entities[item.type].get(item.id);
          if (rec.billing_status !== 'billed') {
             await base44.asServiceRole.entities[item.type].update(item.id, {
                billing_status: "billed",
                freshbooks_invoice_id: transaction.freshbooks_invoice_id,
                freshbooks_invoice_number: transaction.freshbooks_invoice_number,
                billed_date: new Date().toISOString(),
                billing_transaction_id: transaction.id
             });
             await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, action: "source_updated_success", details: `Recovered ${item.type} ${item.id}` });
          }
       } catch (e) {
          hasError = true;
          await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, {
             status: "recovery_required", error_stage: `recovery_update_source_${item.id}`, error_message: e.message
          });
          await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, action: "source_updated_failed", details: `Recovery failed for ${item.type} ${item.id}: ${e.message}` });
          break;
       }
    }

    if (hasError) {
       return Response.json({ status: "recovery_required", error_message: "Partial failure during recovery." });
    }

    await base44.asServiceRole.entities.BillingTransaction.update(transaction.id, {
       status: "completed", completed_date: new Date().toISOString()
    });
    await base44.asServiceRole.entities.BillingAuditLog.create({ request_id, user_id: user.id, action: "transaction_completed", details: "Recovery successful" });

    return Response.json({ status: "completed", invoice_number: transaction.freshbooks_invoice_number });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});