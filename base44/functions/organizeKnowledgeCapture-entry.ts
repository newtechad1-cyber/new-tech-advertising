// organizeKnowledgeCapture — Base44 server function
// K-001: AI organizes raw knowledge captures into structured NTA assets
// Input: raw capture text (+ optional context)
// Output: title, summary, key_idea, series, department, tags, uses, next action

import { AI } from "@base44/sdk";
import { KnowledgeCapture } from "@base44/entities";

export default async function organizeKnowledgeCapture({ captureId }: { captureId: string }) {
  // Fetch the raw capture
  const capture = await KnowledgeCapture.get(captureId);
  if (!capture) throw new Error(`KnowledgeCapture ${captureId} not found`);

  const rawText = capture.raw_capture;
  if (!rawText || rawText.trim().length === 0) {
    throw new Error("No raw_capture text to organize");
  }

  // Build context about existing capture metadata
  const contextParts: string[] = [];
  if (capture.source) contextParts.push(`Source: ${capture.source}`);
  if (capture.capture_type) contextParts.push(`Capture type: ${capture.capture_type}`);
  if (capture.created_from_voice) contextParts.push("Created from voice message");
  if (capture.created_from_client_conversation) contextParts.push("Created from client conversation");
  if (capture.created_from_chat) contextParts.push("Created from Slack/chat");
  if (capture.created_from_file) contextParts.push("Created from uploaded file");

  const contextStr = contextParts.length > 0 ? `\nContext: ${contextParts.join(", ")}` : "";

  const aiResult = await AI.chat({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the NTA Knowledge Engine — Rick Hesse's intellectual property organizer.

Rick is a solo operator running New Tech Advertising, a digital advertising agency in Mason City, Iowa. He is building the NTA Operating System — a comprehensive business management platform. He captures ideas constantly — sales insights, client patterns, operating principles, frameworks, stories, training notes, content seeds.

Your job: Take his raw capture and organize it into a structured NTA knowledge asset.

NTA Operating System Series:
- K-Series: Knowledge assets (documents, frameworks, principles, training)
- E-Series: Execution workflows (SOPs, sales processes, client journeys)
- A-Series: Automation systems (Viktor automations, integrations, crons)
- M-Series: Measurement dashboards (executive, analytics, health monitoring)

NTA Departments:
- 00 Executive Office — Strategy, vision, leadership
- 01 Sales — Lead gen, prospecting, discovery, proposals
- 02 Client Success — Onboarding, delivery, retention, expansion
- 03 Content Production — Social, blog, video, brand
- 04 Operations — Admin, billing, scheduling, project management
- 05 AI & Automation — Viktor workflows, AI tools, integrations
- 90 Knowledge Library — Training, frameworks, IP, documentation

Capture Types: idea, lesson, sales_insight, client_pattern, operating_principle, sop_improvement, story, framework, faq, training_note, content_seed

Output a valid JSON object with exactly these fields:
- "title": Clear, descriptive title for this knowledge asset (NTA style — professional but real)
- "summary": 2-4 sentence summary of what this capture contains
- "key_idea": The single most important insight, distilled to one sentence
- "suggested_series": One of K-Series, E-Series, A-Series, M-Series
- "suggested_department": One of 00_executive_office, 01_sales, 02_client_success, 03_content_production, 04_operations, 05_ai_automation, 90_knowledge_library
- "suggested_capture_type": One of the capture types listed above
- "suggested_document_type": What this should become (e.g., "SOP Document", "Training Module", "Sales Playbook Entry", "Operating Principle", "Framework Document", "FAQ Entry", "Content Brief", "Case Study")
- "tags": Comma-separated tags (5-8 relevant tags)
- "related_assets": Comma-separated list of likely related NTA assets or systems (e.g., "E-002 AI Visibility Audit", "A-005 Social Publishing")
- "possible_uses": 2-4 sentences describing how this knowledge can be used across NTA
- "suggested_next_action": Specific next step (e.g., "Create K-Series training document", "Add to Sales Playbook under Objection Handling", "Draft SOP for client onboarding step 3")
- "priority": One of low, medium, high, urgent

Tone: Direct, practical, Rick's voice. No corporate fluff. Think like a business partner who understands Rick's vision.`
      },
      {
        role: "user",
        content: `RAW CAPTURE:\n${rawText}${contextStr}`
      }
    ],
    response_format: { type: "json_object" },
  });

  const organized = JSON.parse(aiResult.choices[0].message.content);

  // Update the KnowledgeCapture entity with AI-organized fields
  const updateData: Record<string, any> = {
    title: organized.title,
    summary: organized.summary,
    key_idea: organized.key_idea,
    suggested_series: organized.suggested_series,
    department: organized.suggested_department,
    tags: organized.tags,
    related_assets: organized.related_assets,
    possible_uses: organized.possible_uses,
    ai_suggested_document_type: organized.suggested_document_type,
    ai_suggested_next_action: organized.suggested_next_action,
    priority: organized.priority,
    status: "organized",
  };

  // Only set capture_type if not already set manually
  if (!capture.capture_type) {
    updateData.capture_type = organized.suggested_capture_type;
  }

  // Only set suggested_k_number if not already set
  if (!capture.suggested_k_number) {
    // Generate a suggestion based on series
    const seriesPrefix = organized.suggested_series?.replace("-Series", "") || "K";
    updateData.suggested_k_number = `${seriesPrefix}-NEW`;
  }

  const updated = await KnowledgeCapture.update(captureId, updateData);

  return {
    success: true,
    captureId,
    organized,
    status: "organized",
  };
}
