# Pro Available Jobs Page - Upcoming/Past Tabs Implementation

## Summary
Updated the `/pro/jobs` page to display actual bookings with Upcoming/Past tab structure. Changed terminology from "Bookings" to "Available Jobs" throughout the interface.

## Changes Made

### 1. Updated `apps/web/src/components/ProSidebar.tsx`
- Changed sidebar label from "Bookings" to "Available Jobs"

### 2. Updated `apps/web/src/app/pro/jobs/page-listeo.tsx`
- Changed page title from "My Bookings" to "Available Jobs"
- Updated subtitle to show "upcoming jobs" / "past jobs" instead of "bookings"
- Updated empty state messages to use "jobs" terminology
- Implemented Upcoming/Past tab structure with proper status grouping:
  - **Upcoming**: REQUESTED, ACCEPTED, SCHEDULED, IN_PROGRESS
  - **Past**: COMPLETED, CAPTURED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_PRO, NO_SHOW, DISPUTED, REFUNDED

## Features

✅ Tab-based navigation (Upcoming/Past)
✅ Dynamic tab counts
✅ Search by customer name or service
✅ Status badges with color coding
✅ Listeo design theme (teal accent, clean cards)
✅ ProLayout with sidebar navigation
✅ Dark mode support
✅ Mobile responsive design
✅ Click to view job details

## Terminology
- Sidebar: "Available Jobs"
- Page Title: "Available Jobs"
- Tabs: "Upcoming" and "Past"
- Empty states: "No upcoming jobs" / "No past jobs"
- Messages: "New job requests will appear here"

