# 📧 Multilingual Email System

Complete email template system with English and Hungarian support.

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install nodemailer @types/nodemailer
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@ozar.com
EMAIL_FROM_NAME=Ozar

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 3. Update App Module

Add the EmailModule to your `app.module.ts`:

```typescript
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // ... other imports
    EmailModule,
  ],
})
export class AppModule {}
```

### 4. Update Notifications Module

Update `notifications.module.ts` to use the enhanced service:

```typescript
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsEnhancedService } from './notifications-enhanced.service';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [NotificationsController],
  providers: [NotificationsEnhancedService],
  exports: [NotificationsEnhancedService],
})
export class NotificationsModule {}
```

### 5. Add Language Field to User Model

Update your Prisma schema:

```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  firstName         String
  lastName          String
  phone             String
  role              Role     @default(CUSTOMER)
  preferredLanguage String   @default("en") // Add this field
  // ... other fields
}
```

Then run:
```bash
npx prisma migrate dev --name add_preferred_language
```

## 📝 Usage

### In Your Services

```typescript
import { NotificationsEnhancedService } from './notifications/notifications-enhanced.service';

@Injectable()
export class BookingsService {
  constructor(
    private notificationsService: NotificationsEnhancedService,
  ) {}

  async acceptBooking(bookingId: string) {
    // ... your booking logic

    // Send notification + email
    await this.notificationsService.notifyBookingAccepted(
      booking.customerId,
      bookingId,
      proName,
      {
        serviceName: booking.service.name,
        proName: pro.businessName,
        date: booking.scheduledFor.toLocaleDateString(),
        time: booking.scheduledFor.toLocaleTimeString(),
        location: booking.location.address,
        price: booking.pricing.total,
        currency: booking.pricing.currency,
        bookingId: booking.id,
      },
    );
  }
}
```

### Send Welcome Email on Registration

```typescript
// In auth.service.ts
async register(registerDto: RegisterDto) {
  const user = await this.usersService.create(registerDto);
  
  // Send welcome email
  await this.notificationsService.sendWelcomeEmail(user.id);
  
  return user;
}
```

### Send Password Reset Email

```typescript
// In auth.service.ts
async forgotPassword(email: string) {
  const user = await this.usersService.findByEmail(email);
  const resetToken = generateResetToken();
  
  // Save token to database
  await this.saveResetToken(user.id, resetToken);
  
  // Send email
  await this.notificationsService.sendPasswordResetEmail(user.id, resetToken);
}
```

## 🎨 Available Email Templates

1. **Booking Confirmation** - When a booking request is created
2. **Booking Accepted** - When a pro accepts a booking
3. **Booking Cancelled** - When a booking is cancelled
4. **Booking Completed** - When a service is completed
5. **Welcome Email** - When a user registers
6. **Password Reset** - When a user requests password reset

## 🌍 Language Detection

The system automatically detects the user's preferred language from their profile:

```typescript
// User's language is stored in the database
const language = await getUserLanguage(userId); // Returns 'en' or 'hu'

// Email is sent in their preferred language
await emailService.sendEmail({
  to: user.email,
  template: 'bookingConfirmation',
  data: bookingData,
  language, // 'en' or 'hu'
});
```

## 🔧 Testing Emails

### Using Ethereal Email (Development)

1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the credentials to your `.env`:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass
```

4. Check emails at https://ethereal.email/messages

### Using Gmail (Production)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use these credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

## 📧 Email Template Structure

Each template consists of:

1. **Translation File** (`translations.ts`) - All text content in EN/HU
2. **Template File** (`*.template.ts`) - HTML structure
3. **Base Layout** (`base.layout.ts`) - Common header/footer

### Adding a New Template

1. Add translations to `translations.ts`:
```typescript
export const emailTranslations = {
  en: {
    myNewTemplate: {
      subject: 'My Subject',
      title: 'My Title',
      // ... more translations
    },
  },
  hu: {
    myNewTemplate: {
      subject: 'Az én tárgyam',
      title: 'Az én címem',
      // ... more translations
    },
  },
};
```

2. Create template file `my-new-template.template.ts`:
```typescript
import { baseEmailLayout } from './base.layout';

export const myNewTemplate = (data: any, language: 'en' | 'hu' = 'en') => {
  const { t, name } = data;
  
  const content = `
    <h1 class="title">${t.title}</h1>
    <p class="text">${t.greeting} ${name},</p>
    // ... your HTML
  `;
  
  return baseEmailLayout(content, language);
};
```

3. Export in `templates/index.ts`:
```typescript
import { myNewTemplate } from './my-new-template.template';

export const emailTemplates = {
  // ... existing templates
  myNewTemplate,
};
```

4. Add method to `email.service.ts`:
```typescript
async sendMyNewEmail(
  to: string,
  data: any,
  language: 'en' | 'hu' = 'en',
): Promise<void> {
  await this.sendEmail({
    to,
    template: 'myNewTemplate',
    data,
    subject: '',
    language,
  });
}
```

## 🎯 Best Practices

1. **Always include user's language** - Fetch from database
2. **Test both languages** - Ensure translations are complete
3. **Use environment variables** - Never hardcode URLs or credentials
4. **Handle errors gracefully** - Email failures shouldn't break your app
5. **Log email sends** - For debugging and monitoring
6. **Use transactional email service** - For production (SendGrid, AWS SES, etc.)

## 🔐 Security

- Never expose SMTP credentials
- Use app-specific passwords for Gmail
- Validate email addresses before sending
- Rate limit password reset emails
- Use HTTPS for all email links

## 📊 Monitoring

Consider adding:
- Email delivery tracking
- Open rate tracking
- Click tracking
- Bounce handling
- Unsubscribe management

## 🚀 Production Recommendations

For production, consider using:
- **SendGrid** - Easy setup, good free tier
- **AWS SES** - Cost-effective, scalable
- **Mailgun** - Developer-friendly
- **Postmark** - Transactional email specialist

Update your `.env` with the chosen service's SMTP settings.
