/**
 * createAgencyLead — Canonical intake function for ALL NTA lead forms.
 *
 * ALWAYS call this FIRST before any other entity creation or email logic.
 * Guarantees SalesLead + SalesDeal are always created regardless of downstream failures.
 *
 * @param {object} input
 * @param {string} input.business_name  — Required
 * @param {string} [input.contact_name]
 * @param {string} [input.email]
 * @param {string} [input.phone]
 * @param {string} [input.website]
 * @param {string} [input.city]
 * @param {string} [input.state]
 * @param {string} [input.industry]
 * @param {string} [input.notes]
 * @param {string} [input.lead_source]  — defaults to 'website'
 *
 * @returns {{ salesLead: object, salesDeal: object }}
 */
export async function createAgencyLead(input) {
  const { base44 } = await import('@/api/base44Client');

  const salesLead = await base44.entities.SalesLead.create({
    business_name: input.business_name || 'Unknown Business',
    contact_name:  input.contact_name  || '',
    email:         input.email         || '',
    phone:         input.phone         || '',
    website:       input.website       || '',
    city:          input.city          || '',
    state:         input.state         || '',
    industry:      input.industry      || '',
    lead_source:   input.lead_source   || 'website',
    status:        'new',
    notes:         input.notes         || '',
  });

  const salesDeal = await base44.entities.SalesDeal.create({
    lead_id:   salesLead.id,
    deal_name: input.business_name || 'Unknown Business',
    stage:     'New Lead',
    archived:  false,
  });

  console.log('[createAgencyLead] Lead created', salesLead.id, salesDeal.id);

  return { salesLead, salesDeal };
}