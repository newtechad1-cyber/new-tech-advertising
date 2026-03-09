# Hampton-Dumont Demo Presentation Guide

## Overview

This is a complete, presentation-ready demo of School Story Lab with Hampton-Dumont Community Schools as the featured district. All content, branding, and UI have been polished for immediate use in school leader meetings.

## Quick Start

### Seeding the Demo Data

Call this function as an admin to populate all demo content:

```
POST /api/functions/seedHamptonDumontDemoData
```

This will seed:
- **Branding**: Hampton-Dumont colors, logos, messaging
- **Stories**: 5 featured articles (Robotics, Football, Choir, STEM, Community Service)
- **Videos**: 3 published project videos
- **Events**: 4 upcoming school events
- **Spotlights**: 2 staff and student highlights
- **Submissions**: 4 student content submissions (approved)
- **Video Projects**: 4 active projects

## Content Themes

All demo content centers around these relatable school activities:

1. **🤖 Robotics Club**
   - Regional competition highlights
   - Team journey and achievements
   - Student leadership (team captain Alex Rodriguez)

2. **🏈 Friday Night Football**
   - Game recaps and highlights
   - Conference standings
   - Community engagement

3. **🎤 Choir Concert**
   - Spring concert performances
   - Teacher spotlight (Mrs. Chen)
   - Musical excellence

4. **🔬 STEM Showcase**
   - Student project demonstrations
   - Innovation and problem-solving
   - Community impact

5. **🌱 Student Council Service**
   - Community service projects
   - Environmental stewardship
   - Student leadership

## Public Pages (What Parents/Students See)

### SchoolHome (`/schools/hampton-dumont`)
- **Hero Section**: Dynamic intro with school colors and CTAs
- **Featured Stories**: 3 cards showcasing top content
- **Latest Videos**: 3 published videos with thumbnails
- **Spotlights**: Staff and student highlights
- **Upcoming Events**: Calendar of activities
- **CTA**: Prominent submission button

**Mobile Polish**: Responsive typography, 2-column grid on mobile, optimized padding

### Story Detail Pages
- Markdown-formatted content with images
- Publication metadata (author, date)
- Related content links

### Video Gallery
- Video cards with play buttons
- Organized by project type
- Easy filtering and sorting

### Submission Page
- School-friendly form language
- Clear consent requirements
- Multiple file type support
- Confirmation messaging

## Admin Pages (What Teachers/Admins See)

### AdminSchoolDashboard (`/admin/schools/hampton-dumont`)
- **8 Stat Cards**: Key metrics (submissions, projects, stories, videos, events, renders, AI jobs, failures)
- **Recent Activity**: Timeline of submissions
- **Needs Attention**: Smart alerts for actionable items
- **Quick Actions**: 4-button action hub (Review, Create, AI, Write)

**Mobile Polish**: 2-column stat grid, reordered sections on mobile, touch-friendly buttons

### Users Management
- List of school users by role
- Add/edit/delete with modal form
- Role assignment (6 role tiers)
- User status tracking

### Roles & Permissions
- 6 roles displayed with descriptions
- 20+ permission rules organized by category
- Safe defaults clearly marked
- Color-coded role cards

### Branding Settings
- Logo upload with preview
- School name, district, mascot configuration
- Three-color picker (primary, secondary, accent)
- Intro/outro text for videos
- Upload instructions and legal text
- Social media links
- Live preview updates

### School Settings
- General configuration (consent, teacher review, AI, auto-publish)
- File submission rules (size, types, deadline)
- Moderation controls (AI screening)
- Publishing channels (Bulldog TV, Yearbook, YouTube, Facebook, Instagram)

### Settings → Permissions
- 13 granular permission rules
- 4 categories (Submission, Review, Safety, Access)
- Toggle controls with status indicators
- Safe defaults clearly noted

### Settings → Publishing
- 5 publishing channel toggles
- 5 publishing workflow rules
- Channel descriptions and recommendations
- Visibility and sharing controls

## Design Consistency

### Colors (Hampton-Dumont Theme)
- **Primary**: #1e3a5f (Deep Navy)
- **Secondary**: #f59e0b (Amber/Gold)
- **Accent**: #ffffff (White)
- **Grays**: Standard Tailwind gray scale

### Typography
- **Headlines**: Font-black, larger on desktop
- **Body**: Balanced line-height for readability
- **Mobile**: Responsive sizing (text-sm/md on mobile, md/lg on desktop)

### Components
- **Buttons**: Blue-600 primary, slate-700 secondary, rounded-lg
- **Cards**: White bg, shadow-md, rounded-lg, hover:shadow-lg
- **Badges**: Color-coded by status (red=pending, green=approved, yellow=in-progress)
- **Icons**: Lucide React, sized appropriately for mobile

### Spacing
- **Desktop**: 6 (1.5rem) padding/gaps
- **Mobile**: 4 (1rem) padding, stacked layout
- **Sections**: Consistent top/bottom padding (py-12 md:py-20)

## Responsive Design Features

### Mobile-First Approach
- `grid-cols-2 md:grid-cols-4`: 2 columns mobile, 4 desktop
- `text-base md:text-lg`: Smaller font on mobile
- `px-4 md:px-6`: Reduced padding on mobile
- `py-12 md:py-20`: Reduced vertical spacing on mobile
- `hidden sm:block`: Hide secondary text on mobile

### Touch-Friendly
- Buttons minimum 40px height
- Tap targets well-spaced
- Larger icons on mobile devices
- Simplified navigation

### Performance
- Lazy loading of images via placeholder URLs
- Efficient grid layouts
- Minimal animations (hover:scale-105)
- Fast stat card loads

## Demo Flow for School Leaders

### 1. Public Site Tour (5 minutes)
Start at home page. Show:
- Hero with school name and branding
- Featured stories showcase
- Video gallery
- Upcoming events
- Spotlight features
- Submission CTA

### 2. Admin Dashboard Tour (5 minutes)
Go to `/admin/schools/hampton-dumont`. Show:
- Dashboard overview (key metrics)
- Recent activity
- Alerts and needs attention section
- Quick action buttons
- Navigation to key features

### 3. Content Library Tour (5 minutes)
Visit story library, video library, submissions. Show:
- Published content volume
- Status tracking
- Filtering and search
- Easy navigation

### 4. Admin Settings Tour (5 minutes)
Visit settings pages. Show:
- School branding customization
- User management
- Role configuration
- Permission granularity
- Publishing workflow
- Safe defaults

### 5. Submission Workflow (3 minutes)
Go to student submission page. Show:
- Clean, school-friendly form
- Multiple media types
- Consent confirmation
- Legal acknowledgement
- Easy submission process

## Key Talking Points

### For Principals & Admins
- "Complete control over content workflow"
- "Student safety built-in with consent and teacher review"
- "Customizable branding—use your colors, logo, messaging"
- "6-role permission system for flexible access control"
- "Dashboard gives you one-glance status of everything"

### For Teachers & Moderators
- "Easy submission review and approval"
- "Clear status indicators for all content"
- "AI-assisted moderation flags suspicious content"
- "Simple tools for creating stories and publishing videos"
- "Mobile-friendly so you can moderate from anywhere"

### For Students & Families
- "Share your school moments safely and easily"
- "See featured stories from your community"
- "Watch school-produced videos in one place"
- "School controls what gets published—peace of mind"

## Safety Features to Highlight

✅ **Mandatory Consent**: All submissions require explicit consent  
✅ **Teacher Review**: Cannot be disabled—all content reviewed before publishing  
✅ **AI Safety Screening**: Flags inappropriate content automatically  
✅ **Release Agreements**: Legal protection for the school  
✅ **Role-Based Access**: Each user has specific permissions  
✅ **Manual Approval Only**: Auto-publish is disabled by default  
✅ **Activity Logging**: Admin can track all changes  

## Customization Notes

### To Use Different District
1. Change `HAMPTON_DUMONT_SLUG` to your district slug
2. Update `BRANDING` object with your school name, colors, logo
3. Update story/event content to match your calendar
4. Update team/organization names

### To Update Branding
- Edit `SchoolBranding` entity directly or via settings page
- Colors are stored as hex codes
- Logos should be image URLs (can upload via settings)
- Text fields support plain text and basic formatting

### To Add More Content
- Seed function is fully extensible
- Add more stories, videos, events, submissions to arrays
- Adjust dates to match real school calendar
- Update team/group names as needed

## Presentation Tips

1. **Start with Public Site**: Shows the parent/student experience
2. **Show Mobile**: Demo is responsive—show on phone
3. **Navigate to Admin**: Transition from public to admin view
4. **Showcase Dashboard**: Stat cards and alerts catch attention
5. **Walk Through Settings**: Show customization possibilities
6. **Ask Questions**: "What content would you want to feature?"
7. **Discuss Safety**: Emphasize consent and teacher review
8. **Talk Timeline**: Discuss implementation and training

## Technical Notes

- All data is stored in Base44 entities
- School-slug-based multi-tenancy (each school is isolated)
- Routes follow `/schools/{slug}/` and `/admin/schools/{slug}/` patterns
- Real-time updates via Base44 subscriptions
- Mobile-responsive using Tailwind CSS
- Accessible component library (shadcn/ui)

## Support & Next Steps

### If Something Looks Off
1. Check that demo data was seeded correctly
2. Verify school slug in URL matches seeding function
3. Clear browser cache (Cmd/Ctrl + Shift + Delete)
4. Test on different device/browser

### To Schedule Real Demo
1. Coordinate with school IT
2. Ensure they have internet access
3. Test on their WiFi beforehand
4. Have phone as backup demo device
5. Bring credentials for admin login

### After Demo
1. Collect feedback on design and features
2. Discuss customization needs
3. Plan implementation timeline
4. Schedule training sessions
5. Set up real school account

---

**Last Updated**: March 2026  
**Demo Status**: Production Ready  
**Device Support**: Desktop, Tablet, Mobile  
**Browser Support**: Chrome, Firefox, Safari, Edge