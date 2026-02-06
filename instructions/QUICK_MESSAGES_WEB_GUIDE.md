# Quick Messages Feature - Web App Guide

## Overview
The Quick Messages feature allows professionals to create and use message templates for faster communication with customers. This feature is already fully implemented in the web application.

## Access Points

### 1. Pro Dashboard Menu
Navigate to: **Pro Dashboard** → **Quick Messages**
- Direct link in the pro navigation menu
- Accessible from any pro page

### 2. Chat Window (In-Chat Access)
- Open any chat conversation
- Look for the lightning bolt (⚡) button next to the attachment buttons
- Click to open the quick messages modal
- **Note**: Only visible to PRO users

### 3. Direct URL
```
http://localhost:3000/pro/quick-messages
```

## Features

### Template Management
1. **Create Templates**
   - Click "Create Template" button
   - Fill in:
     - Title (e.g., "Initial Greeting")
     - Category (Greeting, Pricing, Scheduling, etc.)
     - Message text
   - Save template

2. **Edit Templates**
   - Click edit icon on any template
   - Modify title, category, or message
   - Save changes

3. **Delete Templates**
   - Click delete icon on any template
   - Confirm deletion

4. **Search & Filter**
   - Search by title or message content
   - Filter by category
   - View all templates in organized grid

### Using Templates in Chat

#### Method 1: Quick Messages Button
1. Open a chat conversation
2. Click the lightning bolt (⚡) button
3. Browse available templates
4. Click on a template to use it
5. Message appears in input field
6. Edit if needed and send

#### Method 2: From Quick Messages Page
1. Go to Quick Messages page
2. Find the template you want
3. Copy the message text
4. Navigate to chat
5. Paste and send

## Template Categories

The system supports these categories:
- **Greeting** - Welcome messages, introductions
- **Pricing** - Price quotes, payment terms
- **Scheduling** - Availability, appointment times
- **Follow-up** - Check-ins, status updates
- **Closing** - Thank you messages, goodbyes
- **FAQ** - Common questions and answers
- **Emergency** - Urgent situations, delays

## UI Components

### Quick Messages Page (`/pro/quick-messages`)
```
┌─────────────────────────────────────────┐
│  Quick Messages                    [+]  │
├─────────────────────────────────────────┤
│  [Search...] [Category Filter ▼]       │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Template 1   │  │ Template 2   │    │
│  │ Category     │  │ Category     │    │
│  │ Message...   │  │ Message...   │    │
│  │ [Edit] [Del] │  │ [Edit] [Del] │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Chat Window Modal
```
┌─────────────────────────────────────────┐
│  ⚡ Quick Messages              [X]     │
├─────────────────────────────────────────┤
│  Select a template to use               │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Initial Greeting          ⚡    │   │
│  │ Hello! Thanks for reaching...   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Price Quote               ⚡    │   │
│  │ Based on your requirements...   │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Manage templates →                     │
└─────────────────────────────────────────┘
```

## Implementation Details

### Backend API Endpoints
```typescript
// Get all quick messages
GET /api/v1/templates/quick-messages

// Create quick message
POST /api/v1/templates/quick-messages
Body: { title, category, message }

// Update quick message
PUT /api/v1/templates/quick-messages/:id
Body: { title, category, message }

// Delete quick message
DELETE /api/v1/templates/quick-messages/:id
```

### Frontend Components
```
apps/web/src/app/pro/quick-messages/page.tsx - Main page
apps/web/src/app/chat/[id]/page.tsx - Chat integration
```

### State Management
```typescript
// Load templates
const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([]);

// Show modal
const [showQuickMessages, setShowQuickMessages] = useState(false);

// Select template
const handleSelectQuickMessage = (message: QuickMessage) => {
  setNewMessage(message.message);
  setShowQuickMessages(false);
};
```

## User Flow

### Creating a Template
1. Pro navigates to Quick Messages page
2. Clicks "Create Template"
3. Fills in form:
   - Title: "Initial Greeting"
   - Category: "Greeting"
   - Message: "Hello! Thanks for reaching out..."
4. Clicks "Save"
5. Template appears in list

### Using a Template
1. Pro opens chat with customer
2. Clicks lightning bolt (⚡) button
3. Modal opens showing templates
4. Pro clicks "Initial Greeting" template
5. Message fills input field
6. Pro can edit or send as-is
7. Message sent to customer

## Best Practices

### Template Organization
- Use clear, descriptive titles
- Categorize templates properly
- Keep messages concise but complete
- Include personalization placeholders

### Message Content
- Be professional and friendly
- Include all necessary information
- Use proper grammar and spelling
- Avoid overly generic responses

### Template Examples

#### Greeting Template
```
Title: Initial Contact
Category: Greeting
Message: Hello! Thanks for reaching out. I'd be happy to help with your project. Could you provide more details about what you need?
```

#### Pricing Template
```
Title: Standard Quote
Category: Pricing
Message: Based on your requirements, the estimated cost would be [AMOUNT] HUF. This includes [SERVICES]. Would you like to proceed?
```

#### Scheduling Template
```
Title: Availability This Week
Category: Scheduling
Message: I'm available this week on Monday, Wednesday, and Friday between 9 AM - 5 PM. What time works best for you?
```

## Troubleshooting

### Templates Not Loading
- Check if user is logged in as PRO
- Verify backend API is running
- Check browser console for errors
- Ensure proper authentication token

### Button Not Visible in Chat
- Confirm user role is PRO (not CUSTOMER)
- Check if chat page loaded correctly
- Verify component rendering

### Templates Not Saving
- Check network tab for API errors
- Verify all required fields are filled
- Ensure backend database is accessible

## Mobile App Parity

The mobile app has the same feature with:
- Quick Messages management screen
- In-chat quick message button
- Same categories and functionality
- Synchronized templates across platforms

## Future Enhancements

### Potential Improvements
1. **Variables/Placeholders**
   - Add customer name automatically
   - Insert booking details
   - Dynamic pricing

2. **Template Sharing**
   - Share templates with team
   - Import/export templates
   - Template marketplace

3. **Analytics**
   - Track template usage
   - Measure response rates
   - Optimize based on data

4. **AI Suggestions**
   - Suggest templates based on context
   - Auto-complete messages
   - Sentiment analysis

---

**Status**: ✅ Fully Implemented
**Platform**: Web Application
**User Role**: PRO only
**Last Updated**: January 29, 2026
