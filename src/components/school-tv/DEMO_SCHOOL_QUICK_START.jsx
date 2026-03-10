# Demo School System - Quick Start

## What Was Built

A **complete fictional demo school system** (North Valley High School) that serves as a sales/demo asset for the School TV platform. Prospects can see a live, working example of what their own school could build.

---

## Key Routes

### Primary Entry Point
- **`/schooltv-deal-room`** ← Main decision-maker landing page (linked from Home banner)

### Demo School Pages
- **`/demo-school-channel`** ← Live demo school streaming channel (6 published stories)
- **`/demo-school-story/{slug}`** ← Individual story detail pages
- **`/demo-school-about`** ← Explains what the demo school is

### Supporting Pages
- `/schooltv` - Sales page
- `/schooltv-demo` - Quick walkthrough

---

## What's Live Right Now

✅ **North Valley High School Channel** is fully seeded with:
- 2 featured stories (sports, theater)
- 2 sports/event stories
- 2 student spotlights
- 1 school announcement
- **Total: 6 published stories**

All content is:
- ✅ Fictional
- ✅ School-safe
- ✅ AI-generated or stock photos only
- ✅ No real student names/likenesses
- ✅ Professional quality

---

## How It Works

### For Prospects
1. Land on `/schooltv-deal-room`
2. See "See a Live Example Channel" section
3. Click to explore `/demo-school-channel`
4. Browse 6 demo stories by category
5. Click a story to see full detail
6. See explanations of how it's fictional but realistic
7. Book a demo to see their own school version

### For Your Team
- **Test:** Visit `/demo-school-channel` to see the live demo
- **Seed more content:** Call `seedDemoSchoolContent` function
- **Publish/unpublish:** Use `publishDemoSchoolContent` function
- **Generate new ideas:** Call `generateDemoSchoolContent` for random story

---

## Database

### Entity 1: DemoSchoolContent
```
- title: "North Valley Falcons Advance..."
- slug: "falcons-state-semifinals"
- content_type: "sports_highlight"
- category: "basketball"
- summary: "Brief description..."
- script: "Full story text..."
- thumbnail_url: "https://images.unsplash.com/..."
- image_urls: ["..."]
- publish_status: "published"
- featured: true/false
- view_count: auto-incremented
```

### Entity 2: DemoSchoolBranding
```
- school_name: "North Valley High School"
- mascot: "Falcons"
- primary_color: "#001a4d" (navy)
- secondary_color: "#c0c0c0" (silver)
- accent_color: "#0052cc" (blue)
- motto: "Soar Higher Every Day"
```

---

## Automation

**Auto-Publish Demo School Content Weekly**
- Runs: Every Monday at 9:00 AM CT
- Function: `generateDemoSchoolContent`
- Purpose: Keeps demo channel fresh

To view automations:
```
Dashboard → Code → Automations → Search "Demo School"
```

---

## Files Created

### Entities
- `entities/DemoSchoolContent.json`
- `entities/DemoSchoolBranding.json`

### Functions
- `functions/generateDemoSchoolContent.js`
- `functions/seedDemoSchoolContent.js` ✅ Executed
- `functions/publishDemoSchoolContent.js`

### Pages
- `pages/DemoSchoolChannel.js`
- `pages/DemoSchoolStoryDetail.js`
- `pages/DemoSchoolAbout.js`

### Updated
- `pages/SchoolTVDealRoom.js` (added demo section)
- `pages/Home.js` (updated banner link)

---

## Testing the System

### 1. View Live Demo Channel
```
Go to: https://[your-app]/demo-school-channel
```

### 2. Check Story Details
```
Click any story card to see: /demo-school-story/falcons-state-semifinals
```

### 3. View from Deal Room
```
Go to: https://[your-app]/schooltv-deal-room
Scroll to "See a Live Example Channel"
Click "Explore Demo Channel"
```

### 4. View Seeded Content
```
Dashboard → Data → DemoSchoolContent
Should show 6 published records
```

---

## Story Examples (What's Seeded)

| Title | Type | Category | Featured |
|-------|------|----------|----------|
| Falcons Advance to State Semifinals | sports_highlight | basketball | ✅ |
| Meet Alex Park: Robotics to Innovation | student_spotlight | academics | |
| Community Coat Drive | school_news | community | |
| Hamilton Musical Breaks Records | event_story | arts | ✅ |
| Debate Team Wins State | club_feature | academics | |
| Principal's Weekly Message | announcement | admin | |

---

## Customization

### Change School Name
Edit `seedDemoSchoolContent.js` and change "North Valley High School" to your desired name, then re-seed.

### Change Colors
Edit `DemoSchoolBranding` record with new hex colors:
- primary_color
- secondary_color
- accent_color

### Add More Stories
Call `generateDemoSchoolContent` multiple times and manually create records in the `DemoSchoolContent` entity.

### Change Automation Schedule
Go to Dashboard → Automations → Edit "Auto-Publish Demo School Content Weekly"

---

## Safety & Compliance

✅ **No Real Data**
- All content is fictional
- No real student names or photos
- No real school districts
- Only stock/AI-generated visuals

✅ **School-Appropriate**
- All content positive and age-appropriate
- Real school activities only
- Professional tone throughout

✅ **Clearly Marked as Demo**
- "Demo School" callouts on all pages
- Explanation of fictional nature
- Transparency about AI generation

---

## Links & CTAs

All pages have:
- **"Book a Demo"** → `https://calendly.com/bulldog-tv-sales`
- **Back to Deal Room** → `/schooltv-deal-room`
- **Category filters** on main channel

---

## Next Steps (Optional)

1. **Add more stories** - Generate more with `generateDemoSchoolContent`
2. **Add video** - Render demo videos from scripts
3. **Add analytics** - Show fictional engagement metrics
4. **Multi-school demo** - Create different school variations
5. **Live generation** - Render actual videos instead of placeholders

---

## Support

- **To test:** Visit `/demo-school-channel` and click around
- **To add content:** Call backend functions from Dashboard
- **To change branding:** Update `DemoSchoolBranding` record
- **To troubleshoot:** Check `DemoSchoolContent` records in Dashboard

---

## Summary

🎯 **Live and working** - 6 demo stories published
📱 **Mobile-friendly** - Responsive design throughout
🎨 **Branded** - Fully themed with North Valley colors
🔗 **Integrated** - Linked from Deal Room and Home
✅ **Safe** - Fictional school, no real data
⚙️ **Automated** - New content weekly (optional)

Ready for prospect demos!