import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { event, data, old_data } = await req.json();

    // Only process update events for streaming_tv proposals
    if (event.type !== 'update' || data.service !== 'streaming_tv') {
      return Response.json({ message: 'Not a streaming_tv proposal update, skipping' });
    }

    // Check if creative_option changed
    if (!data.creative_option || data.creative_option === old_data?.creative_option) {
      return Response.json({ message: 'creative_option unchanged, skipping' });
    }

    const proposalId = event.entity_id;
    const creativeOption = data.creative_option;

    let updateData = {};

    if (creativeOption === 'ai_assisted') {
      updateData.creative_payment_link = 'PASTE_AI_ASSISTED_STRIPE_LINK_HERE';
    } else if (creativeOption === 'hybrid') {
      updateData.creative_payment_link = 'PASTE_HYBRID_STRIPE_LINK_HERE';
    } else if (creativeOption === 'existing_video') {
      updateData.creative_payment_link = '';
      updateData.creative_payment_status = 'not_required';
    }

    // Update the proposal
    await base44.asServiceRole.entities.Proposal.update(proposalId, updateData);

    // Log the activity
    await base44.asServiceRole.entities.ActivityLog.create({
      event_type: 'creative_option_selected',
      summary: 'Creative option selected for Streaming proposal',
      metadata: {
        proposal_id: proposalId,
        creative_option: creativeOption
      },
      user_email: data.created_by || 'system'
    });

    console.log(`[setCreativePaymentLink] Updated proposal ${proposalId} with creative_option=${creativeOption}`);

    return Response.json({ 
      success: true,
      proposal_id: proposalId,
      creative_option: creativeOption,
      payment_link_set: updateData.creative_payment_link || 'none'
    });

  } catch (error) {
    console.error('[setCreativePaymentLink] Error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});