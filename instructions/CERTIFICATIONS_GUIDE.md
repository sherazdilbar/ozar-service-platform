# Certifications & Badges System Guide

## Overview
The certifications system allows professionals to upload their licenses, certifications, and earn badges based on their performance. This builds trust with customers and helps pros stand out.

## Features Implemented

### 1. Certifications Management (For Pros)
**Location:** Mobile App → Pro Menu → Certifications

**What Pros Can Do:**
- ✅ Add new certifications (name, issuing organization, dates, certificate image)
- ✅ View all their certifications with status (PENDING, VERIFIED, REJECTED, EXPIRED)
- ✅ Upload certificate images as proof
- ✅ Track expiry dates

**Certification Statuses:**
- `PENDING` 🕐 - Submitted, waiting for admin verification
- `VERIFIED` ✓ - Approved by admin, shows on profile
- `REJECTED` ✗ - Not approved
- `EXPIRED` ⚠️ - Past expiry date

### 2. Badges System (Auto-Awarded)
**Badges are automatically earned based on achievements:**

- **Verified Professional** ✓ - Identity and credentials verified
- **Top Rated** ⭐ - Consistently high ratings (4.5+ average)
- **Quick Responder** ⚡ - Responds within 15 minutes
- **Reliable** 🎯 - 95%+ completion rate
- **Experienced** 🏆 - 100+ completed jobs

### 3. Display on Pro Profiles
**What Customers See:**
- Verified certifications displayed on pro detail page
- Badges shown prominently
- Trust indicators (verified badge icon)

## How It Works

### For Professionals:

1. **Add Certification:**
   ```
   Mobile App → Pro Menu → Certifications → + Button
   - Enter certification name (e.g., "Licensed Electrician")
   - Enter issuing organization (e.g., "National Electrical Board")
   - Select issue date
   - Optional: Select expiry date
   - Optional: Upload certificate image
   - Submit for verification
   ```

2. **View Status:**
   - All certifications show with color-coded status
   - Pending = Orange (waiting for review)
   - Verified = Green (approved, visible to customers)
   - Rejected = Red (not approved)
   - Expired = Gray (needs renewal)

3. **Earn Badges:**
   - Badges are earned automatically
   - Complete jobs with high ratings
   - Respond quickly to messages
   - Maintain high completion rate

### For Customers:

1. **View Pro Certifications:**
   ```
   Search for pro → Open pro profile → Scroll to "Certifications" section
   - See all verified certifications
   - View badge collection
   - Trust indicators visible
   ```

2. **Filter by Verified Pros:**
   - Search results show badge icons
   - Verified badge = Has verified certifications

## API Endpoints

### Certifications
```typescript
// Get all certifications for logged-in pro
GET /api/v1/certifications

// Add new certification
POST /api/v1/certifications
Body: {
  name: string;
  issuingOrg: string;
  issueDate: string; // ISO date
  expiryDate?: string; // ISO date
  certificateUrl?: string; // Image URL
}

// Update certification
PUT /api/v1/certifications/:id
Body: { ...same as POST }

// Delete certification
DELETE /api/v1/certifications/:id
```

### Badges
```typescript
// Get all badges for logged-in pro
GET /api/v1/certifications/badges

// Award badge (internal/admin only)
POST /api/v1/certifications/badges
Body: {
  badgeType: 'VERIFIED' | 'TOP_RATED' | 'QUICK_RESPONDER' | 'RELIABLE' | 'EXPERIENCED';
}
```

## Integration Points

### 1. Pro Profile Display
**File:** `apps/mobile/app/pro/[id].tsx`

Certifications and badges are now included when fetching pro details:
```typescript
const pro = await prosApi.getProById(id);
// pro.certifications - array of verified certs
// pro.badges - array of earned badges
```

### 2. Search Results
**File:** `apps/mobile/app/(tabs)/index.tsx`

Badges are included in search results to show trust indicators.

### 3. Pro Dashboard
**File:** `apps/mobile/components/ProDashboard.tsx`

Shows certification count and badge count in stats.

## Next Steps to Fully Integrate

### 1. Display Certifications on Pro Profile (Mobile)
Add a certifications section to `apps/mobile/app/pro/[id].tsx`:

```typescript
{/* Certifications Section */}
{pro.certifications && pro.certifications.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Certifications</Text>
    {pro.certifications.map((cert) => (
      <View key={cert.id} style={styles.certCard}>
        <View style={styles.certHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.certName}>{cert.name}</Text>
        </View>
        <Text style={styles.certOrg}>{cert.issuingOrg}</Text>
        <Text style={styles.certDate}>
          Issued: {new Date(cert.issueDate).toLocaleDateString()}
        </Text>
      </View>
    ))}
  </View>
)}

{/* Badges Section */}
{pro.badges && pro.badges.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Badges</Text>
    <View style={styles.badgesRow}>
      {pro.badges.map((badge) => (
        <View key={badge.id} style={styles.badgeChip}>
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
          <Text style={styles.badgeName}>{badge.name}</Text>
        </View>
      ))}
    </View>
  </View>
)}
```

### 2. Show Verified Badge on Pro Cards
In search results, show a verified badge icon for pros with verified certifications.

### 3. Admin Verification Panel (Future)
Create an admin panel to:
- Review pending certifications
- Approve/reject with reasons
- View certificate images
- Manage badge awards

### 4. Auto-Award Badges
Add logic to automatically award badges when pros reach milestones:
- After completing 100 jobs → Award "Experienced" badge
- When rating reaches 4.5+ → Award "Top Rated" badge
- When response time < 15 min → Award "Quick Responder" badge

## Database Schema

```prisma
model Certification {
  id            String   @id @default(uuid())
  proId         String
  name          String
  issuingOrg    String
  issueDate     DateTime
  expiryDate    DateTime?
  certificateUrl String?
  status        CertificationStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  pro           ProProfile @relation(fields: [proId], references: [id])
}

model Badge {
  id          String   @id @default(uuid())
  proId       String
  badgeType   String
  name        String
  description String
  icon        String
  earnedAt    DateTime @default(now())
  
  pro         ProProfile @relation(fields: [proId], references: [id])
}
```

## Testing Guide

1. **Test Adding Certification:**
   - Login as a pro
   - Go to Certifications screen
   - Add a new certification
   - Verify it shows with PENDING status

2. **Test Viewing on Profile:**
   - Login as a customer
   - Search for a pro
   - Open pro profile
   - Verify certifications and badges are visible

3. **Test Badge Display:**
   - Check if badges show in search results
   - Verify badge icons are correct
   - Test badge tooltips/descriptions

## Benefits

**For Professionals:**
- Build credibility and trust
- Stand out from competition
- Showcase qualifications
- Earn recognition for quality work

**For Customers:**
- Make informed decisions
- Trust verified professionals
- See proof of qualifications
- Identify top-rated pros quickly

## Current Status

✅ Backend API complete
✅ Mobile certification management screen complete
✅ Database schema ready
✅ Badge system implemented
✅ Certifications included in pro profile API
⏳ Display on pro profile (customer view) - needs UI implementation
⏳ Badge auto-awarding logic - needs triggers
⏳ Admin verification panel - future feature
