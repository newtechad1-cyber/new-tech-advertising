import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { event_type, entity_id, company_id, related_data } = payload;

    if (!event_type || !company_id) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    let thread = null;
    let message = null;

    // Proposal events
    if (event_type === 'proposal_sent') {
      const proposal = await base44.asServiceRole.entities.Proposal.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        thread_type: 'proposal',
        title: `Proposal: ${proposal.title}`,
        related_proposal_id: entity_id
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'proposal_followup',
        message_body: `Proposal "${proposal.title}" sent to ${proposal.business_name || 'client'}.`,
        visible_to_client: false,
        read_by_admin: true
      };
    } else if (event_type === 'proposal_viewed') {
      const proposal = await base44.asServiceRole.entities.Proposal.get(entity_id);
      thread = await findExistingThread(base44, {
        company_id,
        related_proposal_id: entity_id
      });
      if (thread) {
        message = {
          thread_id: thread.id,
          company_id,
          sender_type: 'system',
          message_type: 'status_update',
          message_body: `Proposal viewed by client (${proposal.last_viewed_date}).`,
          visible_to_client: false,
          read_by_admin: false
        };
      }
    } else if (event_type === 'proposal_accepted') {
      const proposal = await base44.asServiceRole.entities.Proposal.get(entity_id);
      thread = await findExistingThread(base44, {
        company_id,
        related_proposal_id: entity_id
      });
      if (thread) {
        message = {
          thread_id: thread.id,
          company_id,
          sender_type: 'client',
          message_type: 'approval_response',
          message_body: `Proposal accepted on ${proposal.accepted_at || new Date().toISOString()}.`,
          visible_to_client: true,
          read_by_admin: false,
          requires_response: false
        };
        thread = await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
          status: 'resolved'
        });
      }
    }

    // Strategy review events
    else if (event_type === 'review_published') {
      const review = await base44.asServiceRole.entities.StrategyReviews.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        thread_type: 'review',
        title: `${review.review_period_label} Strategy Review Recap`,
        related_review_id: entity_id
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'review_recap',
        message_body: `Your ${review.review_period_label} strategy review is ready. Review the recap below and let us know if you have questions.`,
        visible_to_client: review.visible_to_client,
        read_by_client: false,
        related_review_id: entity_id
      };
    }

    // Deliverable approval events
    else if (event_type === 'approval_requested') {
      const deliverable = await base44.asServiceRole.entities.Deliverables.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        thread_type: 'approval',
        title: `Approval: ${deliverable.title}`,
        related_deliverable_id: entity_id
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'approval_request',
        message_body: `We've prepared "${deliverable.title}" for your review and approval.`,
        visible_to_client: true,
        requires_response: true,
        response_due_date: addDays(new Date(), 3).toISOString().split('T')[0],
        related_deliverable_id: entity_id
      };
      thread = await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
        status: 'waiting_on_client'
      });
    } else if (event_type === 'approval_response') {
      const deliverable = await base44.asServiceRole.entities.Deliverables.get(entity_id);
      thread = await findExistingThread(base44, {
        company_id,
        related_deliverable_id: entity_id
      });
      if (thread) {
        const isApproved = related_data?.approval_status === 'approved';
        message = {
          thread_id: thread.id,
          company_id,
          sender_type: 'client',
          message_type: 'approval_response',
          message_body: isApproved 
            ? `Approved "${deliverable.title}".`
            : `Requested changes to "${deliverable.title}": ${related_data?.feedback || ''}`,
          visible_to_client: true,
          read_by_admin: false,
          requires_response: !isApproved
        };
        if (isApproved) {
          thread = await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
            status: 'resolved'
          });
        } else {
          thread = await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
            status: 'waiting_on_admin'
          });
        }
      }
    }

    // Client request / support events
    else if (event_type === 'client_request_submitted') {
      const clientRequest = await base44.asServiceRole.entities.ClientRequests.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        thread_type: clientRequest.request_type === 'support' ? 'support' : 'change_request',
        title: clientRequest.title,
        related_request_id: entity_id,
        priority: clientRequest.priority
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'client',
        message_type: 'question',
        message_body: clientRequest.message,
        visible_to_client: true,
        requires_response: true,
        response_due_date: addDays(new Date(), 1).toISOString().split('T')[0],
        related_request_id: entity_id
      };
      thread = await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
        status: 'waiting_on_admin'
      });
    }

    // Onboarding / fulfillment milestones
    else if (event_type === 'onboarding_kickoff') {
      const workroom = await base44.asServiceRole.entities.OnboardingWorkrooms.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        workroom_type: 'onboarding',
        workroom_id: entity_id,
        thread_type: 'onboarding',
        title: `Onboarding Kickoff: ${workroom.title || company_id}`,
        visible_to_client: true
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'status_update',
        message_body: `Onboarding has started! We'll be collecting assets and getting everything set up. You'll hear from us with next steps.`,
        visible_to_client: true,
        read_by_admin: true
      };
    } else if (event_type === 'fulfillment_launch') {
      const workroom = await base44.asServiceRole.entities.FulfillmentWorkrooms.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        workroom_type: 'fulfillment',
        workroom_id: entity_id,
        thread_type: 'fulfillment',
        title: `${workroom.title || 'Service'} Launched`,
        visible_to_client: true
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'status_update',
        message_body: `Your ${workroom.service_type} service is now live. We'll deliver regular updates and milestones here.`,
        visible_to_client: true,
        read_by_admin: true
      };
    } else if (event_type === 'monthly_report_published') {
      const report = await base44.asServiceRole.entities.ExecutiveReports.get(entity_id);
      thread = await getOrCreateThread(base44, {
        company_id,
        thread_type: 'fulfillment',
        title: `${report.report_period_label} Report & Update`,
        visible_to_client: report.visible_to_client
      });
      message = {
        thread_id: thread.id,
        company_id,
        sender_type: 'system',
        message_type: 'status_update',
        message_body: `Your ${report.report_period_label} results are ready. ${report.executive_summary}`,
        visible_to_client: report.visible_to_client,
        read_by_client: false
      };
    }

    // Create message if generated
    if (message) {
      message.sender_user_id = message.sender_type === 'admin' ? user.id : undefined;
      await base44.asServiceRole.entities.Messages.create(message);
      
      // Update thread's last_message_date
      if (thread) {
        await base44.asServiceRole.entities.MessageThreads.update(thread.id, {
          last_message_date: new Date().toISOString()
        });
      }
    }

    return Response.json({
      success: true,
      thread_id: thread?.id,
      message_created: !!message,
      event_type
    });

  } catch (error) {
    console.error('Error auto-threading message:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function getOrCreateThread(base44, threadData) {
  // Check for existing thread
  const existing = await base44.asServiceRole.entities.MessageThreads.filter({
    company_id: threadData.company_id,
    thread_type: threadData.thread_type,
    status: { $ne: 'closed' }
  });

  // Match by related entity if available
  if (threadData.related_proposal_id) {
    const match = existing.find(t => t.related_proposal_id === threadData.related_proposal_id);
    if (match) return match;
  }
  if (threadData.related_review_id) {
    const match = existing.find(t => t.related_review_id === threadData.related_review_id);
    if (match) return match;
  }
  if (threadData.related_request_id) {
    const match = existing.find(t => t.related_request_id === threadData.related_request_id);
    if (match) return match;
  }
  if (threadData.workroom_id) {
    const match = existing.find(t => t.workroom_id === threadData.workroom_id);
    if (match) return match;
  }

  // Create new thread
  return await base44.asServiceRole.entities.MessageThreads.create({
    ...threadData,
    visible_to_client: threadData.visible_to_client !== false
  });
}

async function findExistingThread(base44, query) {
  const threads = await base44.asServiceRole.entities.MessageThreads.filter({
    company_id: query.company_id,
    status: { $ne: 'closed' }
  });

  if (query.related_proposal_id) {
    return threads.find(t => t.related_proposal_id === query.related_proposal_id);
  }
  if (query.related_review_id) {
    return threads.find(t => t.related_review_id === query.related_review_id);
  }
  if (query.related_deliverable_id) {
    return threads.find(t => t.related_deliverable_id === query.related_deliverable_id);
  }
  if (query.related_request_id) {
    return threads.find(t => t.related_request_id === query.related_request_id);
  }

  return null;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}