import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const response = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
            file_url: "https://media.base44.com/files/public/691f41a18de4a7f498c8f884/cf4ff1887_BlogCleanupImageAssignmentInstructions.docx",
            json_schema: {
                type: "object",
                properties: {
                    duplicate_posts_criteria: { type: "array", items: { type: "string" } },
                    post_to_keep: { type: "string" },
                    image_assignments: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                image_name_or_keyword: { type: "string" },
                                target_post_title: { type: "string" }
                            }
                        }
                    }
                }
            }
        });
        
        return Response.json(response);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});