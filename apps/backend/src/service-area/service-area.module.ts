import { Module } from '@nestjs/common';
import { ServiceAreaController } from './service-area.controller';
import { ServiceAreaService } from './service-area.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceAreaController],
  providers: [ServiceAreaService],
  exports: [ServiceAreaService],
})
export class ServiceAreaModule {}
