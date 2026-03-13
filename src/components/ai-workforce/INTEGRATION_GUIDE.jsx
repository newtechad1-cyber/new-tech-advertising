# AI Agent Workforce Orchestrator - Integration Guide

## Overview
The AI Agent Workforce Orchestrator is a centralized job coordination system for all AI content and marketing agents. It manages job queuing, priority scheduling, retry logic, and client notifications.

## Key Components

### 1. Job Queue System
- **Entity**: `AIJobQueue` - Stores all job records
- **Status**: queued → running → completed (or failed → retry → queued)

### 2. Priority Levels
- **Critical**: High urgency, 1 hour timeout (e.g., onboarding campaigns, inactivity rescue)
- **High**: Important but not urgent, 4 hour timeout (e.g., weekly content, urgent campaigns)
- **Medium**: Standard priority, 12 hour timeout (e.g., content generation)
- **Low**: Background tasks, 24 hour timeout (e.g., optimization passes)

### 3. Job Types

#### High Priority
- `onboarding_campaign` - Initial content setup for new clients
- `retention_rescue` - Emergency outreach for inactive users
- `upgrade_campaign` - Personalized upgrade messaging

#### Medium Priority
- `weekly_content_plan` - Weekly strategy and content recommendations
- `content_generation` - General content creation
- `video_script` - AI-generated video scripts
- `social_posts` - Social media content
- `seo_article` - Long-form SEO articles

#### Low Priority
- `content_refresh` - Updating existing content
- `optimization_pass` - Performance optimization

## Usage Examples

### Create a Job Manually
```javascript
import { createJob } from '@/components/ai-workforce/aiWorkforceOrchestrator';

const job = await createJob({
  client_id: 'subscription_123',
  business_name: 'Smith HVAC',
  job_type: 'content_generation',
  trigger_source: 'user_request',
  priority: 'medium',
});
```

### Trigger Jobs from System Events
```javascript
import { triggerOnboardingJobs } from '@/components/ai-workforce/jobTriggerUtils';

// When onboarding completes
await triggerOnboardingJobs('subscription_123', 'Smith HVAC');

// When scheduling weekly content
await triggerWeeklyContentJobs('subscription_123', 'Smith HVAC');

// When user shows upgrade readiness
await triggerUpgradeCampaignJob('subscription_123', 'Smith HVAC', 'guided_growth');

// When user is inactive
await triggerRetentionRescueJob('subscription_123', 'Smith HVAC', 7);
```

## Integration Points
- DIYOnboarding completion → trigger onboarding jobs
- Weekly scheduler → trigger content planning
- Retention engine inactivity → trigger rescue job
- Automation rules high readiness → trigger upgrade campaign
- Client dashboard → show active job status

## Admin Dashboard
Access at `/admin/ai-operations` for queue management, reprioritization, and metrics.