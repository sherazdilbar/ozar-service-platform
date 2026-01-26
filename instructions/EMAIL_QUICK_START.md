# 📧 Email System - Quick Start Guide

## 🎯 TL;DR

Multilingual email system (EN/HU) is ready! Emails automatically send on:
- ✅ User registration (Welcome)
- ✅ Booking created (Confirmation)
- ✅ Booking accepted (Accepted)
- ✅ Booking cancelled (Cancelled)
- ✅ Booking completed (Completed)

## ⚡ Quick Setup (2 minutes)

### 1. Get Test Email Account
```bash
# Go to https://ethereal.email/
# Click "Create Ethereal Account"
# Copy the username and password
```

### 2. Update .env
```bash
# Edit apps/backend/.env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<paste-ethereal-username>
SMTP_PASS=<paste-ethereal-password>
EMAIL_FROM=noreply@ozar.com
EMAIL_FROM_NAME=Ozar
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend
```bash
cd apps/backend
npm run start:dev
```

### 4. Test It!
```bash
# Register a new user via web app
# Check https://ethereal.email/messages
# You should see a welcome email! 🎉
```

## 🌍 Language Support

Users receive emails in their preferred language:

```typescript
// User with preferredLanguage = "en" → English emails
// User with preferredLanguage = "hu" → Hungarian emails
```

To change a user's language:
```sql
UPDATE users SET "preferredLanguage" = 'hu' WHERE email = 'user@example.com';
```

## 📧 Available Templates

| Template | Trigger | Languages |
|----------|---------|-----------|
| Welcome | User registration | EN, HU |
| Booking Confirmation | Booking created | EN, HU |
| Booking Accepted | Pro accepts | EN, HU |
| Booking Cancelled | Pro cancels | EN, HU |
| Booking Completed | Pro completes | EN, HU |
| Password Reset | Forgot password | EN, HU |

## 🔧 How It Works

```typescript
// 1. User performs action (e.g., registers)
// 2. Service fetches user's preferredLanguage from DB
// 3. Email sent in that language
// 4. User receives email in their language! 🎉
```

## 🚀 Production Setup

### Gmail (Quick)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<16-char-app-password>
```

### SendGrid (Recommended)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
```

## 📝 Adding New Templates

1. Add translations to `apps/backend/src/email/translations.ts`
2. Create template in `apps/backend/src/email/templates/`
3. Add method to `EmailService`
4. Call from your service

Example:
```typescript
// In your service
await this.notificationsService.sendWelcomeEmail(userId);
```

## 🐛 Troubleshooting

**Emails not sending?**
- Check SMTP credentials in `.env`
- Check backend console for errors
- Verify Ethereal account at https://ethereal.email/

**Wrong language?**
- Check user's `preferredLanguage` in database
- Default is "en" if not set

**Can't see emails?**
- Check https://ethereal.email/messages
- Emails appear instantly after sending

## 📚 Full Documentation

See `EMAIL_SYSTEM_SETUP_COMPLETE.md` for complete details.

## ✨ That's It!

The email system is production-ready and automatically sends multilingual emails based on user preferences. No additional configuration needed! 🎉
