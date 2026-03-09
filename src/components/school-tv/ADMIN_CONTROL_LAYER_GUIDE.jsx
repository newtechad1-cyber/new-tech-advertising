# School Story Lab - Admin Control Layer Guide

## Overview
The administration control layer provides district admins, principals, and teachers with comprehensive tools to manage users, roles, branding, and settings across their school instances.

## Architecture

### 1. Users Management (`/admin/schools/:schoolSlug/users`)
**File:** `pages/AdminSchoolUsers.jsx`

Manages school staff, teachers, and contributor access.

**Features:**
- Add/edit/delete users
- Assign roles (district admin, principal, teacher, reviewer, contributor, student media lead)
- Track active/inactive status
- View user contact information
- Bulk user management

**Entities:**
- `SchoolUsers` - School-specific user assignments with role and permission data
- Uses Base44 `User` entity for authentication and core user data

**Component:**
- `UserFormModal` - Reusable modal for adding/editing users with role selection

---

### 2. Roles & Permissions (`/admin/schools/:schoolSlug/roles`)
**File:** `pages/AdminSchoolRoles.jsx`

Define what each role can do in the system.

**Built-in Roles:**
1. **District Admin** - Full system access across all schools
2. **Principal/Admin Staff** - Administrative oversight and approvals
3. **Teacher/Editor** - Create and edit school content
4. **Reviewer** - Review and approve submissions
5. **Contributor** - Submit content for review
6. **Student Media Lead** - Student leader managing submissions

**Permission Categories:**
- Content Management (create, edit, view)
- Review & Moderation (approve, reject, moderate)
- Publishing (publish, submit for review)
- Administration (manage users, roles, settings)
- Analytics & AI (view reports, use AI tools)

**Key Features:**
- View role descriptions and assigned permissions
- Edit permissions (in future releases)
- Safe defaults with admin override capability
- Role-based access control throughout platform

---

### 3. Branding (`/admin/schools/:schoolSlug/branding`)
**File:** `pages/AdminSchoolBranding.jsx`

Customize school's visual identity and messaging.

**Customizable Elements:**
- **Logo & Identity**
  - School logo upload
  - School name
  - District name
  - Network/platform name (e.g., "Bulldog Story Lab")

- **Brand Colors**
  - Primary color (main UI elements)
  - Secondary color (accents)
  - Accent color (text on primary backgrounds)

- **Video Templates**
  - Intro text (shown at start of videos)
  - Outro text (shown at end of videos)

- **Submission Page**
  - Upload instructions
  - Legal release text

- **Contact & Social**
  - Contact email
  - Social media URLs (YouTube, Facebook, Instagram)

**Entity:** `SchoolBranding`

**Features:**
- Live color preview
- Logo preview
- Brand identity preview
- All changes auto-saved

---

### 4. Settings - General (`/admin/schools/:schoolSlug/settings`)
**File:** `pages/AdminSchoolSettings.jsx`

Core configuration for content workflow and safety.

**General Settings:**
- Require consent checkbox
- Require media release signature
- Enable AI content generation tools
- Auto-publish approved content (disabled by default)

**Submission Rules:**
- Max file size (default 500MB)
- Allowed file types
- Submission deadline
- Allow public submissions
- Require teacher review

**Moderation Rules:**
- AI safety screening flag suspicious content
- Safe defaults messaging

**Publishing Settings:**
- Bulldog TV (school hub)
- Yearbook integration
- Social media sharing options

**Safe Defaults:**
- ✓ Teacher review required
- ✓ Consent verified
- ✓ AI safety screening enabled
- ✓ Auto-publish disabled

---

### 5. Settings - Permissions (`/admin/schools/:schoolSlug/settings/permissions`)
**File:** `pages/AdminSchoolSettingsPermissions.jsx`

Fine-grained control over what actions are allowed.

**Permission Categories:**

**Content Submission**
- Allow student submissions
- Allow anonymous submissions
- Require school account

**Content Review**
- Require teacher approval
- Require principal review
- Auto-publish after approval

**Content Safety**
- Require consent checkbox (always on)
- Require media release agreement
- Enable AI safety screening
- Require age verification

**Access Control**
- Staff can edit student work
- Students can delete own submissions
- Parents can view content

**Safe Defaults:**
All safety-critical permissions are enabled by default and locked to ensure student protection.

---

### 6. Settings - Publishing (`/admin/schools/:schoolSlug/settings/publishing`)
**File:** `pages/AdminSchoolSettingsPublishing.jsx`

Control where and how content is published.

**Publishing Channels:**
- Bulldog TV (school hub) - Default on
- Yearbook Integration - Default on
- YouTube - Optional
- Facebook - Optional
- Instagram - Optional

**Publishing Rules:**
- Require approval before publishing
- Manual publishing only (no auto-publish)
- Show contributor names
- Allow commenting on published content
- Allow sharing to social media

**Recommended Workflow:**
1. Student/staff submits with consent
2. Teacher reviews and approves
3. Admin conducts final check
4. Admin manually triggers publish
5. Monitor engagement and safety

---

## Data Schema

### SchoolUsers Entity
```javascript
{
  school_slug: string,
  user_email: string,
  full_name: string,
  role: enum[district_admin, principal, teacher, reviewer, contributor, student_media_lead],
  is_active: boolean (default: true),
  permissions: string (JSON array for custom overrides),
  invited_date: datetime,
  last_login: datetime,
  notes: string
}
```

### SchoolSettings Entity
```javascript
{
  school_slug: string,
  // Core safety settings
  require_consent: boolean (default: true),
  require_teacher_review: boolean (default: true),
  require_release_signature: boolean (default: true),
  ai_content_moderation: boolean (default: true),
  // Features
  enable_ai_tools: boolean (default: true),
  auto_publish: boolean (default: false),
  allow_public_submissions: boolean (default: false),
  enable_social_sharing: boolean (default: false),
  // Technical
  max_file_size_mb: number (default: 500),
  allowed_file_types: string (default: "mp4,mov,jpg,png,gif"),
  submission_deadline: date,
  manual_publish_only: boolean (default: true)
}
```

### SchoolBranding Entity (Existing)
Used for visual customization and branding assets.

---

## Integration Points

### Routes
All routes follow the pattern: `/admin/schools/:schoolSlug/[section]`

Registered in `schoolRouteConfig.jsx`:
```javascript
settings: {
  root: (schoolSlug) => `/admin/schools/${schoolSlug}/settings`,
  permissions: (schoolSlug) => `/admin/schools/${schoolSlug}/settings/permissions`,
  publishing: (schoolSlug) => `/admin/schools/${schoolSlug}/settings/publishing`,
}
users: {
  list: (schoolSlug) => `/admin/schools/${schoolSlug}/users`,
  detail: (schoolSlug, userId) => `/admin/schools/${schoolSlug}/users/${userId}`,
}
roles: (schoolSlug) => `/admin/schools/${schoolSlug}/roles`
branding: (schoolSlug) => `/admin/schools/${schoolSlug}/branding`
```

### Navigation
Admin sidebar includes Administration section:
- Users
- Roles
- Branding
- Settings

### Components
- `AdminShell` - Layout wrapper with sidebar and auth
- `UserFormModal` - Reusable form modal for user management
- All components use Base44 SDK for data operations

---

## Safety Principles

1. **Default to Safe** - All safety-critical settings default to ON
2. **Manual Approval** - Auto-publish is disabled by default
3. **Teacher Review** - Required in default workflow
4. **Consent Verification** - Always required
5. **AI Screening** - Flags suspicious content for human review
6. **Student Protection** - Role-based access prevents unauthorized access
7. **Audit Trail** - All content changes logged
8. **Age Appropriate** - Content checked against student safety guidelines

---

## Implementation Notes

### Current State
- Pages created and functional
- UI/UX designed for districts
- Branding page fully implemented
- Settings with safe defaults
- Roles clearly defined
- Users management ready

### Future Enhancements
- User invitations via email
- Bulk user import (CSV)
- Custom role creation (enterprise)
- Permission audit logs
- Activity tracking
- Advanced analytics
- SSO integration (Google Workspace, Microsoft)
- Two-factor authentication
- API key management

### Testing Checklist
- [ ] Add/edit users with different roles
- [ ] Toggle permissions and verify changes save
- [ ] Verify safe defaults are enforced
- [ ] Test navigation between settings pages
- [ ] Verify branding changes apply to public pages
- [ ] Test role permission enforcement
- [ ] Verify school slug routing works correctly
- [ ] Test with different user roles

---

## Best Practices for Districts

1. **Start with Defaults** - Use the safe default settings for your first year
2. **Gradual Enablement** - Enable additional features as staff becomes comfortable
3. **Training** - Train teachers on consent requirements and student safety
4. **Review Workflow** - Establish clear approval process with teacher and admin sign-off
5. **Monitor** - Regularly review published content and user activity
6. **Communicate** - Make expectations clear to students and staff
7. **Iterate** - Adjust settings based on feedback and incidents
8. **Document** - Keep written policies aligned with system settings