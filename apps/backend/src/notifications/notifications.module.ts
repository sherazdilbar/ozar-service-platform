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
