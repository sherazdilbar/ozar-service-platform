# Notification System - Analysis & Improvements

## Current Implementation Status

### ✅ What's Already Working

1. **Backend Infrastructure**
   - ✅ Notification model in database (Prisma schema)
   - ✅ NotificationsService with basic CRUD operations
   - ✅ NotificationsEnhancedService with email integration
   - ✅ NotificationsController with REST endpoints
   - ✅ Notification types enum (11 types)

2. **API Endpoints**
   - ✅ `GET /notifications` - Get user notifications
   - ✅ `GET /notifications/unread-count` - Get unread count
   - ✅ `PUT /notifications/:id/read` - Mark as read
   - ✅ `PUT /notifications/read-all` - Mark all as read

3. **Frontend Components**
   - ✅ NotificationsDropdown component in Header
   - ✅ Bell icon with unread badge
   - ✅ Dropdown with notification list
   - ✅ Mark as read functionality
   - ✅ Mark all as read functionality
   - ✅ Auto-polling every 10 seconds
   - ✅ Click to navigate to booking/chat

4. **API Client**
   - ✅ notificationsApi methods in shared package

### ❌ What's Missing or Broken

1. **Real-time Updates**
   - ❌ No WebSocket/Socket.IO integration
   - ❌ Relies on polling (10-second intervals)
   - ❌ Not instant notification delivery

2. **Notification Triggers**
   - ⚠️ May not be triggered in all booking flows
   - ⚠️ Need to verify all booking status changes trigger notifications
   - ⚠️ Message notifications may not be working

3. **Mobile App**
   - ❌ Mobile app has notifications.tsx but may not be fully integrated
   - ❌ No push notifications for mobile

4. **UI/UX Issues**
   - ⚠️ Notification dropdown may not show in dark mode properly
   - ⚠️ No sound/visual alert for new notifications
   - ⚠️ No notification preferences/settings

5. **Testing**
   - ❌ No way to test notifications easily
   - ❌ No admin panel to send test notifications

## Issues to Fix

### Priority 1: Critical

1. **Verify Notification Triggers**
   - Check if notifications are created when:
     - Customer creates booking → PRO gets notification
     - PRO accepts booking → Customer gets notification
     - PRO declines booking → Customer gets notification
     - Booking completed → Customer gets notification
     - New message → Recipient gets notification

2. **Fix Notification Type Mapping**
   - Frontend uses different type names than backend
   - Frontend: `NEW_BOOKING`, `NEW_MESSAGE`
   - Backend: `BOOKING_REQUEST`, `MESSAGE_RECEIVED`

### Priority 2: Important

3. **Add Real-time Updates**
   - Integrate Socket.IO for instant notifications
   - Remove polling or use as fallback

4. **Improve Mobile Integration**
   - Connect mobile app to notification system
   - Add push notifications (Expo Notifications)

5. **Better Error Handling**
   - Handle API failures gracefully
   - Show error messages to user
   - Retry failed requests

### Priority 3: Nice to Have

6. **Notification Preferences**
   - Let users choose which notifications to receive
   - Email vs in-app preferences
   - Notification frequency settings

7. **Notification History Page**
   - Full page to view all notifications
   - Filter by type, date, read/unread
   - Bulk actions (delete, mark as read)

8. **Rich Notifications**
   - Show booking details in notification
   - Show user avatars
   - Action buttons (Accept/Decline from notification)

## Quick Fixes

### Fix 1: Update Notification Type Mapping

The frontend uses different type names. Let's standardize:

**apps/web/src/components/NotificationsDropdown.tsx**
```typescript
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_REQUEST':  // Changed from NEW_BOOKING
      return '📋';
    case 'BOOKING_ACCEPTED':
      return '✅';
    case 'BOOKING_DECLINED':
      return '❌';
    case 'BOOKING_COMPLETED':
      return '🎉';
    case 'BOOKING_CANCELLED':
      return '🚫';
    case 'MESSAGE_RECEIVED':  // Changed from NEW_MESSAGE
      return '💬';
    case 'REVIEW_RECEIVED':
      return '⭐';
    case 'VERIFICATION_APPROVED':
      return '✅';
    case 'VERIFICATION_REJECTED':
      return '❌';
    default:
      return '🔔';
  }
};
```

### Fix 2: Verify Booking Notifications

Check that bookings service calls notification service:

**apps/backend/src/bookings/bookings.service.ts**
- ✅ `accept()` method calls `notifyBookingAccepted()`
- ✅ `decline()` method calls `notifyBookingCancelled()`
- ⚠️ Need to verify `create()` method calls `notifyBookingRequest()`

### Fix 3: Add Dark Mode Support

**apps/web/src/components/NotificationsDropdown.tsx**
```typescript
// Update classes to support dark mode
<div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifications</h3>
    ...
  </div>
  ...
</div>
```

### Fix 4: Add Error Handling

```typescript
const loadUnreadCount = async () => {
  try {
    const data = await notificationsApi.getUnreadCount();
    setUnreadCount(data.count || 0);
  } catch (error) {
    console.error('Failed to load unread count:', error);
    // Don't show error to user for background polling
  }
};

const loadNotifications = async () => {
  try {
    setLoading(true);
    const data = await notificationsApi.getNotifications();
    setNotifications(data);
  } catch (error: any) {
    console.error('Failed to load notifications:', error);
    // Show error in dropdown
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};
```

## Testing Checklist

### Test Scenario 1: Booking Request
1. Customer creates a booking
2. PRO should receive notification
3. Check:
   - ✅ Notification appears in PRO's dropdown
   - ✅ Unread count increases
   - ✅ Email sent to PRO
   - ✅ Clicking notification navigates to booking

### Test Scenario 2: Booking Accepted
1. PRO accepts a booking
2. Customer should receive notification
3. Check:
   - ✅ Notification appears in Customer's dropdown
   - ✅ Unread count increases
   - ✅ Email sent to Customer
   - ✅ Clicking notification navigates to booking

### Test Scenario 3: Booking Declined
1. PRO declines a booking
2. Customer should receive notification
3. Check:
   - ✅ Notification appears in Customer's dropdown
   - ✅ Shows decline reason
   - ✅ Email sent to Customer

### Test Scenario 4: Mark as Read
1. Click on a notification
2. Check:
   - ✅ Notification marked as read (no blue dot)
   - ✅ Unread count decreases
   - ✅ Navigates to correct page

### Test Scenario 5: Mark All as Read
1. Click "Mark all read"
2. Check:
   - ✅ All notifications marked as read
   - ✅ Unread count becomes 0
   - ✅ Blue dots removed from all notifications

## Recommended Improvements

### 1. Add Socket.IO for Real-time Notifications

**Backend:**
```typescript
// apps/backend/src/notifications/notifications.gateway.ts
@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  notifyUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }
}
```

**Frontend:**
```typescript
// apps/web/src/contexts/NotificationContext.tsx
useEffect(() => {
  const socket = io(API_URL);
  
  socket.on('notification', (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    // Show toast notification
  });

  return () => socket.disconnect();
}, []);
```

### 2. Add Notification Sound

```typescript
const playNotificationSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play().catch(e => console.log('Could not play sound:', e));
};
```

### 3. Add Toast Notifications

Use a library like `react-hot-toast` or `sonner`:

```typescript
import { toast } from 'sonner';

socket.on('notification', (notification) => {
  toast.success(notification.title, {
    description: notification.message,
    action: {
      label: 'View',
      onClick: () => router.push(`/bookings/${notification.data.bookingId}`)
    }
  });
});
```

### 4. Add Notification Preferences

```typescript
// User settings
interface NotificationPreferences {
  email: {
    bookingRequest: boolean;
    bookingAccepted: boolean;
    bookingCompleted: boolean;
    messages: boolean;
  };
  push: {
    bookingRequest: boolean;
    bookingAccepted: boolean;
    bookingCompleted: boolean;
    messages: boolean;
  };
}
```

## Next Steps

1. **Immediate:** Fix notification type mapping
2. **Immediate:** Add dark mode support
3. **Short-term:** Verify all notification triggers work
4. **Short-term:** Add better error handling
5. **Medium-term:** Add Socket.IO for real-time updates
6. **Medium-term:** Integrate mobile push notifications
7. **Long-term:** Add notification preferences
8. **Long-term:** Create full notifications page

## Files to Modify

### High Priority
- ✅ `apps/web/src/components/NotificationsDropdown.tsx` - Fix types and dark mode
- ⚠️ `apps/backend/src/bookings/bookings.service.ts` - Verify notification triggers
- ⚠️ `apps/backend/src/chat/chat.service.ts` - Add message notifications

### Medium Priority
- `apps/backend/src/notifications/notifications.gateway.ts` - Add Socket.IO
- `apps/web/src/contexts/NotificationContext.tsx` - Add context for real-time
- `apps/mobile/app/notifications.tsx` - Integrate mobile notifications

### Low Priority
- `apps/web/src/app/notifications/page.tsx` - Create full notifications page
- `apps/web/src/app/settings/notifications/page.tsx` - Add preferences page
