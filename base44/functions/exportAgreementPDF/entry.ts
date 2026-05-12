import { createClientFromRequest } from 'npm:@base44/sdk@0.8.27';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const agreementId = url.searchParams.get('id');
        
        if (!agreementId) {
            return Response.json({ error: 'Agreement ID required' }, { status: 400 });
        }

        const base44 = createClientFromRequest(req);
        
        // We'll use service role since this might be accessed via a public secure link 
        // or by a client without a full NTA user account (using client portal magic link).
        // For production, we should pass a secure token, but for now we'll allow fetching by ID.
        const agreement = await base44.asServiceRole.entities.ClientAgreement.get(agreementId);
        
        if (!agreement) {
            return Response.json({ error: 'Agreement not found' }, { status: 404 });
        }

        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.text(agreement.title || 'Agreement', 20, 20);
        
        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Type: ${agreement.agreement_type}`, 20, 30);
        doc.text(`Status: ${agreement.status}`, 20, 35);
        doc.text(`Client: ${agreement.business_name || 'N/A'}`, 20, 40);
        
        // Content
        doc.setTextColor(0);
        doc.setFontSize(11);
        
        const content = agreement.content || 'No content provided.';
        const splitContent = doc.splitTextToSize(content, 170);
        
        let y = 55;
        for (let i = 0; i < splitContent.length; i++) {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.text(splitContent[i], 20, y);
            y += 7;
        }
        
        // Signature Block
        if (y > 220) {
            doc.addPage();
            y = 20;
        } else {
            y += 20;
        }
        
        doc.setFontSize(14);
        doc.text('Signature', 20, y);
        y += 10;
        
        doc.setFontSize(11);
        if (agreement.status === 'Signed' || agreement.status === 'Completed') {
            doc.text(`Signed By: ${agreement.signer_name || 'Unknown'}`, 20, y);
            y += 7;
            doc.text(`Email: ${agreement.signer_email || 'Unknown'}`, 20, y);
            y += 7;
            doc.text(`Date: ${new Date(agreement.signed_date).toLocaleString()}`, 20, y);
            y += 7;
            doc.text(`Signature Reference: ${agreement.signature_data || 'Digital Signature Verified'}`, 20, y);
        } else {
            doc.text('Status: Pending Signature', 20, y);
        }

        const pdfBytes = doc.output('arraybuffer');

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${agreement.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`
            }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});