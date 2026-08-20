import { createClientFromRequest } from 'npm:@base44/sdk@0.8.27';
import { jsPDF } from 'npm:jspdf@2.5.1';

function isAdminUser(user) {
    const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
        .split(',')
        .map(value => value.trim().toLowerCase())
        .filter(Boolean);

    return Boolean(
        user &&
        (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
    );
}

Deno.serve(async (req) => {
    try {
        if (req.method !== 'GET') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const url = new URL(req.url);
        const agreementId = String(url.searchParams.get('id') || '').trim();

        if (!/^[A-Za-z0-9_-]{1,128}$/.test(agreementId)) {
            return Response.json({ error: 'Invalid agreement ID' }, { status: 400 });
        }

        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me().catch(() => null);

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!isAdminUser(user)) {
            return Response.json({ error: 'Admin access required' }, { status: 403 });
        }

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
        console.error('Agreement PDF export failed:', error);
        return Response.json({ error: 'Unable to export agreement' }, { status: 500 });
    }
});