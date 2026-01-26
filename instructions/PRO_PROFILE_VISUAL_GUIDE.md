# PRO Profile - Visual Design Guide

## Design Overview

### Color Palette
```
Primary (PRO):     #00BCD4 (Teal)
Secondary:         #06B6D4 (Cyan)
Accent Blue:       #3B82F6
Accent Purple:     #A855F7
Accent Green:      #10B981
Success:           #22C55E
Warning:           #F59E0B
Error:             #EF4444
```

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    👁️ Preview    💾 Save Changes      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Complete Your Profile                          65%   │  │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │  📸 Add profile photo  🖼️ Add 2 more portfolio items │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────┬────────────────────────────────────────────┐  │
│  │ Sidebar  │  Main Content Area                         │  │
│  │          │                                             │  │
│  │ ✓ Basic  │  [Tab Content Here]                        │  │
│  │ ✓ Categ. │                                             │  │
│  │ ⚠ Locat. │                                             │  │
│  │ ⚠ Portf. │                                             │  │
│  │ ⚠ Certif.│                                             │  │
│  │          │                                             │  │
│  └──────────┴────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Designs

### 1. Profile Completion Card
```
┌─────────────────────────────────────────────────────────┐
│  Complete Your Profile                            65%   │
│  A complete profile gets 3x more customer views!        │
│                                                           │
│  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                           │
│  📸 Add profile photo                                    │
│  🖼️ Add 2 more portfolio items                          │
│  🏷️ Add service categories                              │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Gradient background (teal to cyan)
- White text
- Animated progress bar
- Clickable action items
- Dynamic percentage

### 2. Sidebar Navigation
```
┌──────────────────────┐
│ Profile Sections     │
├──────────────────────┤
│ 👤 Basic Info     ✓ │ ← Complete
│ 💼 Services       ✓ │ ← Complete
│ 📍 Location       ⚠ │ ← Incomplete
│ 🖼️ Portfolio (3)  ⚠ │ ← Incomplete
│ 🏆 Certifications ⚠ │ ← Incomplete
└──────────────────────┘
```

**Features:**
- Icon for each section
- Completion indicator (✓ or ⚠)
- Badge counter for portfolio
- Active state highlighting
- Sticky positioning

### 3. Basic Info Tab

#### Profile Photo Section
```
┌─────────────────────────────────────────────────────┐
│  📷 Profile Photo                                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ┌─────────┐    A professional photo helps         │
│   │         │    customers trust you                 │
│   │  Photo  │                                        │
│   │   📷    │    ✓ Use a clear, well-lit photo      │
│   └─────────┘    ✓ Show your face clearly           │
│                  ✓ Smile and look professional       │
└─────────────────────────────────────────────────────┘
```

#### Business Details
```
┌─────────────────────────────────────────────────────┐
│  Business Name *                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ John's Plumbing Services                      │ │
│  └───────────────────────────────────────────────┘ │
│                                                       │
│  Professional Bio *                                 │
│  ┌───────────────────────────────────────────────┐ │
│  │ Professional plumber with 10 years of         │ │
│  │ experience in residential and commercial...   │ │
│  └───────────────────────────────────────────────┘ │
│  Write at least 50 characters        125 / 50     │
│                                                       │
│  Contact Phone *                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ +36 20 123 4567                               │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Years of Experience
```
┌─────────────────────────────────────────────────────┐
│  Years of Experience                                │
├─────────────────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  │
│  │ <1 │  │ 1  │  │ 3  │  │ 5  │  │ 10 │  │ 15 │  │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘  │
│  ┌────┐  ┌────┐                                    │
│  │ 20 │  │25+ │                                    │
│  └────┘  └────┘                                    │
└─────────────────────────────────────────────────────┘
```

#### Availability Status
```
┌─────────────────────────────────────────────────────┐
│  Availability Status                                │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────┐│
│  │    🟢    │  │    🟡    │  │    🔴    │  │  ⚫ ││
│  │Available │  │Available │  │   Busy   │  │ Off ││
│  │   Now    │  │   Soon   │  │          │  │line ││
│  └──────────┘  └──────────┘  └──────────┘  └─────┘│
└─────────────────────────────────────────────────────┘
```

### 4. Categories Tab

#### Selected Categories Section
```
┌─────────────────────────────────────────────────────┐
│  ⭐ Your Selected Categories              3 active  │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │    🔧    │  │    🔌    │  │    🚰    │         │
│  │ Handyman │  │Electrician│ │ Plumber  │         │
│  │    ✓     │  │    ✓     │  │    ✓     │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│  Click to remove                                    │
└─────────────────────────────────────────────────────┘
```

#### Category Groups
```
┌─────────────────────────────────────────────────────┐
│  ─────── Home Repairs & Maintenance ───────        │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │    🔌    │  │    🚰    │  │    🔧    │         │
│  │Electrician│ │ Plumber  │  │ Handyman │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│  Click to add                                       │
│                                                       │
│  ─────── Renovation & Installation ───────         │
│  [More categories...]                               │
└─────────────────────────────────────────────────────┘
```

### 5. Location Tab

#### Base Location
```
┌─────────────────────────────────────────────────────┐
│  🏠 Your Base Location          📍 Auto-Detect     │
├─────────────────────────────────────────────────────┤
│  City *                                             │
│  ┌───────────────────────────────────────────────┐ │
│  │ Budapest                                  ⏳  │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ 📍 Budapest, Hungary                          │ │ ← Dropdown
│  │ 📍 Budapest, Pest County, Hungary            │ │
│  └───────────────────────────────────────────────┘ │
│                                                       │
│  Area/District/Neighborhood                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ District V                                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                       │
│  ✓ Location confirmed: Budapest, District V        │
└─────────────────────────────────────────────────────┘
```

#### Service Coverage
```
┌─────────────────────────────────────────────────────┐
│  🚗 Service Coverage Area                           │
├─────────────────────────────────────────────────────┤
│  Service Radius: 25 km                              │
│  ├────────────────●──────────────────────────────┤ │
│  5 km            25 km                      50 km  │
│                                                       │
│  💡 You'll appear in search results for customers   │
│     within this radius                              │
└─────────────────────────────────────────────────────┘
```

### 6. Portfolio Tab

#### Upload Section
```
┌─────────────────────────────────────────────────────┐
│  Add New Portfolio Items                            │
├─────────────────────────────────────────────────────┤
│  Title                    Category                  │
│  ┌──────────────────┐    ┌──────────────────────┐  │
│  │Kitchen Renovation│    │Kitchen/Bath Remodel  │  │
│  └──────────────────┘    └──────────────────────┘  │
│                                                       │
│  Description                                        │
│  ┌───────────────────────────────────────────────┐ │
│  │ Complete kitchen renovation with modern...    │ │
│  └───────────────────────────────────────────────┘ │
│                                                       │
│  ┌───────────────────────────────────────────────┐ │
│  │              📸 Upload Portfolio Photos       │ │
│  │     Up to 10 images • Max 5MB each           │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Portfolio Grid
```
┌─────────────────────────────────────────────────────┐
│  Your Portfolio (6 items)                  ✓ Complete│
├─────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ Image  │  │ Image  │  │ Image  │  │ Image  │   │
│  │   1    │  │   2    │  │   3    │  │   4    │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
│  ┌────────┐  ┌────────┐                            │
│  │ Image  │  │ Image  │                            │
│  │   5    │  │   6    │                            │
│  └────────┘  └────────┘                            │
│                                                       │
│  Hover to see details and delete option             │
└─────────────────────────────────────────────────────┘
```

#### Portfolio Item Hover State
```
┌────────────────┐
│                │
│     Image      │
│                │
│ ┌────────────┐ │
│ │Kitchen Ren │ │ ← Overlay appears
│ │Complete... │ │
│ │            │ │
│ │ 🗑️ Delete  │ │
│ └────────────┘ │
└────────────────┘
```

## Responsive Breakpoints

### Desktop (1024px+)
- Sidebar: Fixed width, left side
- Main content: Flexible width
- Grid: 4 columns for categories/portfolio
- Full navigation visible

### Tablet (768px - 1023px)
- Sidebar: Collapsible or top navigation
- Main content: Full width
- Grid: 3 columns
- Compact spacing

### Mobile (< 768px)
- Sidebar: Bottom navigation or hamburger
- Main content: Full width, stacked
- Grid: 2 columns
- Touch-optimized buttons

## Animation Specifications

### Transitions
```css
/* Standard transition */
transition: all 0.3s ease;

/* Hover scale */
transform: scale(1.05);

/* Progress bar */
transition: width 0.5s ease-in-out;

/* Fade in */
animation: fadeIn 0.3s ease-in;

/* Slide in */
animation: slideIn 0.3s ease-out;
```

### Hover Effects
- Buttons: Scale 1.05, shadow increase
- Cards: Border color change, shadow increase
- Images: Scale 1.1, overlay fade in
- Links: Color change, underline

## Accessibility Features

### Color Contrast
- Text on white: #111827 (gray-900)
- Text on dark: #F9FAFB (gray-50)
- Links: #00BCD4 (teal-600)
- Focus rings: 2px solid teal

### Focus States
```
All interactive elements have visible focus indicators:
- Inputs: 2px ring, teal color
- Buttons: 2px ring, teal color
- Links: Underline + color change
- Cards: Border highlight
```

### Screen Reader Support
- All images have alt text
- Form labels properly associated
- ARIA labels on icon buttons
- Status messages announced
- Semantic HTML structure

## Dark Mode Variations

### Color Adjustments
```
Light Mode          Dark Mode
─────────────────────────────────
#FFFFFF (white)  →  #1F2937 (gray-800)
#F9FAFB (gray-50) → #111827 (gray-900)
#111827 (gray-900)→ #F9FAFB (gray-50)
#6B7280 (gray-500)→ #9CA3AF (gray-400)

Borders:
#E5E7EB (gray-200)→ #374151 (gray-700)

Backgrounds:
#F3F4F6 (gray-100)→ #1F2937 (gray-800)
```

### Component Examples

#### Light Mode Card
```
Background: #FFFFFF
Border: #E5E7EB
Text: #111827
Shadow: rgba(0,0,0,0.1)
```

#### Dark Mode Card
```
Background: #1F2937
Border: #374151
Text: #F9FAFB
Shadow: rgba(0,0,0,0.3)
```

## Typography Scale

```
Heading 1:  text-4xl (36px) font-bold
Heading 2:  text-2xl (24px) font-bold
Heading 3:  text-xl (20px) font-bold
Heading 4:  text-lg (18px) font-semibold
Body:       text-base (16px) font-normal
Small:      text-sm (14px) font-normal
Tiny:       text-xs (12px) font-normal
```

## Spacing System

```
Gap/Padding Scale:
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
16 = 4rem (64px)
```

## Icon Usage

### Icon Sizes
- Small: w-4 h-4 (16px)
- Medium: w-5 h-5 (20px)
- Large: w-6 h-6 (24px)
- XL: w-8 h-8 (32px)

### Icon Colors
- Primary: text-teal-600
- Secondary: text-gray-600
- Success: text-green-600
- Warning: text-orange-600
- Error: text-red-600

## Best Practices

### Do's ✅
- Use consistent spacing
- Maintain color contrast ratios
- Provide visual feedback on interactions
- Use semantic HTML
- Test on multiple devices
- Support keyboard navigation
- Provide loading states
- Show error messages clearly

### Don'ts ❌
- Don't use color alone to convey information
- Don't make clickable areas too small (<44px)
- Don't use low contrast text
- Don't forget focus indicators
- Don't block user interactions during loading
- Don't use ambiguous error messages
- Don't auto-play animations
- Don't forget mobile optimization

---

**Design System Version:** 1.0.0
**Last Updated:** January 18, 2026
