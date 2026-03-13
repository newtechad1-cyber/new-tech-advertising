# DIY First Value Experience - Integration Guide

---

## Overview
Lightweight onboarding UX to guide new users to first marketing win in 15 minutes. Increases activation through quick wins + psychological reinforcement.

**Components:**
1. Welcome banner (congratulate signup, explain next step)
2. Quick-start panel (3 easy actions)
3. Success modal (trigger on first action completion)

---

## Components

### 1. FirstValueWelcome
**File:** `components/diy/FirstValueWelcome.jsx`

Shows on first login to welcome new user and explain the plan.

**Props:**
```jsx
<FirstValueWelcome 
  onDismiss={() => { /* handle dismiss */ }}
  userName="John Doe"
/>
```

**Features:**
- Sparkles icon + personalized greeting
- 3-step plan explanation
- "Let's Go" CTA
- Dismissible with X button

**Display:**
```
┌─────────────────────────┐
│ ✨ Welcome, John! 🎉   │
│ You're all set. Let's   │
│ get your first win...   │
│                         │
│ Here's the plan:        │
│ 1. Pick quick action    │
│ 2. Complete (5-10 min)  │
│ 3. See impact now       │
│                         │
│ [Let's Go] ────────────│
└─────────────────────────┘
```

---

### 2. FirstValueQuickStart
**File:** `components/diy/FirstValueQuickStart.jsx`

Shows 3 quick-start actions user can choose from.

**Props:**
```jsx
<FirstValueQuickStart 
  onActionStart={(actionId, actionType) => {
    // Navigate to action or show editor
    // actionId: 'social_post' | 'campaign' | 'video_script'
    // actionType: 'GenerateSocialPost' | 'CreateCampaign' | 'GenerateVideoScript'
  }}
  completedActions={['social_post']}  // Array of completed action IDs
/>
```

**Actions:**
| Action | Time | Description |
|--------|------|-------------|
| Create First Social Post | 5 min | AI-powered social content generator |
| Launch First Campaign | 10 min | Campaign setup wizard |
| Write First Video Script | 7 min | Video script generator |

**Features:**
- 3 action cards with time estimates
- Disabled/greyed out when completed
- Green "✓ Done" badge when completed
- Pro tip callout at bottom
- Color-coded by action type

**Display:**
```
┌────────────────────────────────┐
│ ⚡ Quick-Start Actions         │
│ Choose one action...            │
├────────────────────────────────┤
│ 📱 Create First Social Post    │
│    Generate AI post (5 min)    │ ← Clickable
├────────────────────────────────┤
│ 🎯 Launch First Campaign       │
│    Set up campaign (10 min)    │ ← Clickable
├────────────────────────────────┤
│ 🎥 Write First Video Script    │
│    Create script (7 min)       │ ← Clickable
├────────────────────────────────┤
│ 💡 Pro tip: Start with post... │
└────────────────────────────────┘
```

---

### 3. FirstActionSuccessModal
**File:** `components/diy/FirstActionSuccessModal.jsx`

Shows success celebration when user completes first action.

**Props:**
```jsx
<FirstActionSuccessModal 
  isOpen={true}
  actionType="social_post"  // Which action was completed
  onClose={() => { /* hide modal */ }}
  onNextStep={(actionType) => {
    // Handle "View Post" or next action
  }}
/>
```

**Triggers for:**
- `social_post` → "Your First Post is Live! 🎉"
- `campaign` → "Campaign Launched! 🚀"
- `video_script` → "Script Ready to Go! 🎬"

**Features:**
- Big emoji + success headline
- Achievement badge
- Success reinforcement message
- Next action suggestion
- "Continue Browsing" + "View [Action]" buttons
- Footer motivational text

**Display:**
```
┌──────────────────────────────┐
│                              │
│          📱                  │
│  Your First Post is Live! 🎉 │
│                              │
│  Congratulations! Your post  │
│  is now live on social...   │
│                              │
│ ✓ Post Created              │
│                              │
│ 💫 You just took action!     │
│    This is the first step... │
│                              │
│ What's next?                 │
│ Create another post or try..│
│                              │
│ [Browse] [View Post →]      │
│                              │
│ You're on your way! 💪      │
└──────────────────────────────┘
```

---

## State Management Hook

### useFirstValueTracking
**File:** `components/diy/useFirstValueTracking.js`

Custom hook to manage onboarding state.

**Usage:**
```jsx
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
} = useFirstValueTracking(userId);
```

**Functionality:**
- Detects new users (no OnboardingProfile exists)
- Tracks completed actions
- Manages modal visibility
- Persists state to OnboardingProfile entity
- Fires analytics events

**Analytics Events:**
- `diy_first_action_completed` — when user completes first action
- `diy_welcome_dismissed` — when user dismisses welcome

---

## Dashboard Integration

### In DIYDashboard or similar:

```jsx
import FirstValueWelcome from '@/components/diy/FirstValueWelcome';
import FirstValueQuickStart from '@/components/diy/FirstValueQuickStart';
import FirstActionSuccessModal from '@/components/diy/FirstActionSuccessModal';
import { useFirstValueTracking } from '@/components/diy/useFirstValueTracking';

export default function DIYDashboard() {
  const user = await base44.auth.me();
  const {
    isNewUser,
    showWelcome,
    completedActions,
    lastCompletedAction,
    showSuccessModal,
    trackFirstAction,
    dismissWelcome,
    closeSuccessModal
  } = useFirstValueTracking(user?.id);

  return (
    <div className="space-y-6">
      {/* Welcome banner - shown only to new users */}
      {showWelcome && isNewUser && (
        <FirstValueWelcome 
          onDismiss={dismissWelcome}
          userName={user?.full_name}
        />
      )}

      {/* Quick-start panel - always show, shows progress */}
      <FirstValueQuickStart 
        onActionStart={(actionId, actionType) => {
          // Navigate to action editor
          if (actionId === 'social_post') {
            navigate('/diy/social-planner?mode=create');
          } else if (actionId === 'campaign') {
            navigate('/diy/campaigns?mode=create');
          } else if (actionId === 'video_script') {
            navigate('/diy/video-studio?mode=script');
          }
        }}
        completedActions={completedActions}
      />

      {/* Success modal - shown when action completed */}
      <FirstActionSuccessModal 
        isOpen={showSuccessModal}
        actionType={lastCompletedAction}
        onClose={closeSuccessModal}
        onNextStep={(actionType) => {
          // Navigate to next step
          if (actionType === 'social_post') {
            navigate('/diy/social-planner');
          }
        }}
      />

      {/* Rest of dashboard */}
    </div>
  );
}
```

---

## Action Tracking Flow

```
User signs up
    ↓
First login → Show FirstValueWelcome
    ↓
User clicks action → Navigate to editor/generator
    ↓
User completes action → trackFirstAction(actionId) called
    ↓
OnboardingProfile.completedActions updated
    ↓
FirstActionSuccessModal shown
    ↓
User sees "Continue" or "View Result" CTA
    ↓
Dashboard updates: show ✓ Done badge on completed action
```

---

## Data Model

### OnboardingProfile Entity
**Fields:**
```javascript
{
  userId: string,                  // User email/ID
  onboardingStatus: enum,          // 'welcome_shown' | 'welcome_dismissed' | 'first_action_completed'
  firstActionAt: date,             // When first action completed
  completedActions: JSON array,    // ['social_post', 'campaign']
  createdAt: date
}
```

---

## Analytics & Metrics

### Track These Events
1. **diy_first_action_completed**
   - Fired when user finishes first action
   - Metric: Track % of new users completing first action
   - Goal: > 60% activation within 7 days

2. **diy_welcome_dismissed**
   - Fired when user closes welcome banner
   - Metric: Track if users skipped onboarding flow

3. **diy_action_selected**
   - Track which action users pick most often
   - Guide future onboarding improvements

---

## UX Principles

✅ **DO:**
- Show welcome only to new users
- Make first action easy (5-10 min max)
- Celebrate immediately upon completion
- Show clear progress (completed actions marked)
- Keep messaging positive & motivational

❌ **DON'T:**
- Force onboarding (allow skipping)
- Make first actions complex
- Delay success celebration
- Show generic "congratulations" (personalize)
- Overwhelm with too many next steps

---

## Customization Points

### Change welcome message:
Edit `FirstValueWelcome.jsx` heading/description

### Add more quick-start actions:
Edit `QUICK_START_ACTIONS` array in `FirstValueQuickStart.jsx`

### Change success modal messages:
Edit `ACTION_SUCCESS_CONFIG` in `FirstActionSuccessModal.jsx`

### Adjust action completion tracking:
Customize `trackFirstAction()` in `useFirstValueTracking.js`

---

## Testing Checklist

- [ ] New user sees welcome banner on first login
- [ ] User can dismiss welcome banner
- [ ] Quick-start panel shows all 3 actions
- [ ] Clicking action navigates correctly
- [ ] Completing action shows success modal
- [ ] Completed action shows ✓ Done badge
- [ ] OnboardingProfile created for new user
- [ ] Analytics events fired correctly
- [ ] Welcome not shown to returning users