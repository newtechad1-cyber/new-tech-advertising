# NTA DIY First Value Experience - Dashboard Integration Guide

---

## Overview

Complete onboarding flow for new DIY users with welcome banner, 4-action quick-start panel, success modals with next-step suggestions, and visual progress tracker.

**Goal:** Get new users to first marketing win in <15 minutes and sustain momentum through first week.

---

## Components & Files

1. **FirstValueWelcome** — Welcome banner on first login
2. **FirstValueQuickStart** — 4-action quick-start panel with benefits
3. **FirstActionSuccessModal** — Success celebration + next-step suggestions
4. **FirstWeekMomentumTracker** — Visual progress through 4 milestones
5. **useFirstValueTracking** — State management hook
6. **useNextStepSuggestion** — Next-step recommendation logic

---

## Quick-Start Actions (4 Cards)

### Card 1: Create First Social Post
```
📱 Create First Social Post
Generate AI-powered social content in minutes
Benefit: Get your first piece of content live today
⏱️ 5 min
```

### Card 2: Launch First Campaign
```
⚡ Launch First Campaign
Set up your first marketing campaign in minutes
Benefit: Automate content distribution & start seeing results
⏱️ 10 min
```

### Card 3: Write First Video Script
```
🎥 Write First Video Script
Generate a script for your first video
Benefit: Video drives 3x more engagement than text
⏱️ 7 min
```

### Card 4: Log Your First Lead
```
📊 Log Your First Lead
Track where your leads come from
Benefit: Build your lead source database & measure ROI
⏱️ 3 min
```

**Card Display:**
- Icon + Title
- Description (what they do)
- Benefit statement (why it matters) ← NEW
- Time estimate
- Start button
- Green ✓ Done badge when completed

---

## Next-Step Suggestion Logic

**After completing ANY action, the success modal shows:**
- Smart recommendation for which action to do next
- Contextual reason why it's the next best step
- Available alternative actions
- Primary CTA for recommended action
- Secondary CTA for current action details

**Logic Flow:**

```
User completes social_post
    ↓
Success modal shows:
  "Your Post is Live!"
  "Next, launch a campaign to automate more content"
  (Why: Campaigns multiply reach by automating posts)
    ↓
Buttons:
  [Continue] [Launch Campaign →] [View Post →]
```

**Recommendation Matrix:**

| Completed | Recommended Next | Why |
|-----------|-----------------|-----|
| Social Post | Campaign | Automate content multiplies reach |
| Campaign | Video Script | Video drives 3x more engagement |
| Video Script | Social Post | Quick wins while video producing |
| Log Lead | Social Post | Content drives more leads |

---

## First-Week Momentum Tracker

**4-Step Visual Progress:**

```
┌─────────────────────────────────┐
│ First-Week Momentum    [4/4]    │
│ Progress: ▓▓▓▓░░░░░░░ 100%    │
├─────────────────────────────────┤
│ ✅ Onboarding Complete          │
│    Account set up and ready     │
│                                 │
│ ─→ ✅ First Content Created     │
│      Social post, video, blog   │
│                                 │
│ ─→ ✅ First Campaign Launched   │
│      Content automation running │
│                                 │
│ ─→ ✅ First Activity Logged     │
│      Lead, click, engagement    │
├─────────────────────────────────┤
│ 🎉 Marketing activated!         │
│    You've completed first week. │
│    Now scale!                   │
└─────────────────────────────────┘
```

**Milestone Messages:**
- 0 complete: "Ready to start? Pick any action below..."
- 1 complete: "Great start! Keep the momentum going."
- 2 complete: "You're on fire! Almost there!"
- 3 complete: "One step away! Complete your last milestone."
- 4 complete: "Marketing activated! Now scale!" ✨

---

## Dashboard Integration

### Step 1: Add to DIYDashboard

```jsx
import FirstValueWelcome from '@/components/diy/FirstValueWelcome';
import FirstValueQuickStart from '@/components/diy/FirstValueQuickStart';
import FirstActionSuccessModal from '@/components/diy/FirstActionSuccessModal';
import FirstWeekMomentumTracker from '@/components/diy/FirstWeekMomentumTracker';
import { useFirstValueTracking } from '@/components/diy/useFirstValueTracking';

export default function DIYDashboard() {
  const user = await base44.auth.me();
  const {
    isNewUser,
    showWelcome,
    completedActions,
    lastCompletedAction,
    showSuccessModal,
    isLoading,
    trackFirstAction,
    dismissWelcome,
    closeSuccessModal
  } = useFirstValueTracking(user?.id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome banner - new users only */}
      {showWelcome && isNewUser && (
        <FirstValueWelcome 
          onDismiss={dismissWelcome}
          userName={user?.full_name}
        />
      )}

      {/* Progress tracker - all users */}
      <FirstWeekMomentumTracker 
        completedActions={completedActions}
        isNewUser={isNewUser}
      />

      {/* Quick-start panel - all users */}
      <FirstValueQuickStart 
        onActionStart={(actionId, actionType) => {
          // Track the action start
          trackFirstAction(actionId);
          
          // Navigate to action
          if (actionId === 'social_post') {
            navigate('/diy/social-planner?mode=create');
          } else if (actionId === 'campaign') {
            navigate('/diy/campaigns?mode=create');
          } else if (actionId === 'video_script') {
            navigate('/diy/video-studio?mode=script');
          } else if (actionId === 'log_lead') {
            navigate('/diy/leads?mode=add');
          }
        }}
        completedActions={completedActions}
      />

      {/* Success modal */}
      <FirstActionSuccessModal 
        isOpen={showSuccessModal}
        actionType={lastCompletedAction}
        completedActions={completedActions}
        onClose={closeSuccessModal}
        onNextStep={(actionId) => {
          // Navigate to next action
          if (actionId === 'social_post') {
            navigate('/diy/social-planner?mode=create');
          } else if (actionId === 'campaign') {
            navigate('/diy/campaigns?mode=create');
          } else if (actionId === 'video_script') {
            navigate('/diy/video-studio?mode=script');
          } else if (actionId === 'log_lead') {
            navigate('/diy/leads?mode=add');
          }
        }}
      />

      {/* Rest of dashboard */}
      <div>... other dashboard content ...</div>
    </div>
  );
}
```

### Step 2: Hook Completion Events

When user completes an action in your editors, call `trackFirstAction`:

```jsx
// In SocialPostEditor.jsx
const handlePublishPost = async () => {
  await api.publishPost(postData);
  
  // Track completion
  const { trackFirstAction } = useFirstValueTracking(userId);
  trackFirstAction('social_post');
  
  // Modal will auto-show
};
```

---

## Using Next-Step Suggestion Hook

```jsx
import { useNextStepSuggestion, getNextActionLabel } from '@/components/diy/useNextStepSuggestion';

// In any component
const suggestion = useNextStepSuggestion(completedActions);

// suggestion structure:
{
  title: "Your Post is Live!",
  message: "Next, set up a campaign...",
  recommendedAction: "campaign",
  why: "Campaigns multiply reach...",
  availableAlternatives: ["video_script", "log_lead"]
}

// Get readable action label
const label = getNextActionLabel('campaign');
// → "Launch a campaign"
```

---

## First-Week Momentum Milestones

**Milestone 1: Onboarding Complete**
- Triggered: Automatically on first login
- Shows: User is ready to take action

**Milestone 2: First Content Created**
- Triggered: `social_post` OR `video_script` action completed
- Shows: User created their first piece of content

**Milestone 3: First Campaign Launched**
- Triggered: `campaign` action completed
- Shows: User is automating content

**Milestone 4: First Activity Logged**
- Triggered: `log_lead` action completed
- Shows: User is tracking results

**All 4 Complete?**
→ "Marketing Activated!" badge + encouragement to scale

---

## Analytics Events

Track these for insights:

```javascript
// Welcome shown
'diy_welcome_shown'
{ isNewUser: true }

// Welcome dismissed
'diy_welcome_dismissed'
{}

// Action started
'diy_action_started'
{ actionType: 'social_post' }

// Action completed
'diy_first_action_completed'
{ actionType: 'social_post', completedCount: 1 }

// Success modal shown
'diy_success_modal_shown'
{ actionType: 'social_post', hadNextSuggestion: true }

// User clicked next-step suggestion
'diy_next_step_clicked'
{ currentAction: 'social_post', nextAction: 'campaign' }

// Milestone completed
'diy_milestone_reached'
{ milestone: 'first_content_created', completedCount: 2 }
```

---

## Customization Points

### Change quick-start actions:
Edit `QUICK_START_ACTIONS` in `FirstValueQuickStart.jsx`
- Add/remove actions
- Update benefits
- Adjust time estimates

### Change next-step recommendations:
Edit `NEXT_STEP_LOGIC` in `useNextStepSuggestion.js`
- Modify recommendation matrix
- Change suggestion messages
- Add new action dependencies

### Change momentum milestones:
Edit `MILESTONE_STEPS` in `FirstWeekMomentumTracker.jsx`
- Rename milestones
- Change completion conditions
- Update progress messages

### Change welcome message:
Edit text in `FirstValueWelcome.jsx`
- Personalize greeting
- Update next steps explanation

---

## User Journey

```
Day 1 - First Login:
  ↓
Welcome banner shows + momentum tracker shows progress
  ↓
User picks action from 4-card panel
  ↓
User navigates to editor/creator
  ↓
User completes action
  ↓
Success modal shows with next-step suggestion
  ↓
Momentum tracker updates with ✓ badge

Days 2-7:
  ↓
User keeps completing actions
  ↓
Momentum tracker progresses
  ↓
Each success modal guides next step
  ↓
By day 7: All 4 milestones complete → "Marketing Activated!"
```

---

## Mobile Considerations

- Quick-start cards stack vertically on mobile
- Momentum tracker is fully responsive
- Success modal buttons flex on small screens
- Touch-friendly button sizing (44px min)
- Modal footer motivational text is concise

---

## Testing Checklist

- [ ] New user sees welcome banner
- [ ] Welcome can be dismissed
- [ ] Momentum tracker shows on first login
- [ ] All 4 quick-start action cards display
- [ ] Time estimates show for each card
- [ ] Benefit statements are clear and compelling
- [ ] Clicking action navigates correctly
- [ ] Completing action triggers success modal
- [ ] Success modal shows next-step suggestion
- [ ] Suggestion buttons work and navigate
- [ ] Completed action shows ✓ Done badge
- [ ] Momentum tracker updates with checkmarks
- [ ] All 4 milestones trigger correctly
- [ ] Final "Marketing Activated" message shows
- [ ] Analytics events fire for all actions
- [ ] Mobile layout is responsive
- [ ] Returning users don't see welcome banner
- [ ] Next-step logic suggests all actions

---

## Success Metrics

- **Activation Rate:** % of new users completing ≥1 action within 24 hours
- **Momentum Completion:** % of users completing all 4 milestones within 7 days
- **Action Adoption:** Which quick-start actions are most popular?
- **Next-Step Suggestion CTR:** % of users clicking suggested action in modal
- **Time to First Win:** Average time from signup to first action completion

**Target Goals:**
- 70%+ of new users complete first action within 24 hours
- 50%+ of new users complete all 4 milestones within 7 days
- 40%+ of users click the suggested next action