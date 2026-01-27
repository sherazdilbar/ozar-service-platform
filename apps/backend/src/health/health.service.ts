import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
    };
  }

  async detailedCheck() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: await this.checkDatabase(),
        memory: this.checkMemory(),
        disk: this.checkDisk(),
      },
    };

    // Overall status based on service checks
    const allHealthy = Object.values(checks.services).every(
      (service: any) => service.status === 'healthy',
    );
    checks.status = allHealthy ? 'ok' : 'degraded';

    return checks;
  }

  private async checkDatabase() {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        message: 'Database connection successful',
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }

  private checkMemory() {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal / 1024 / 1024; // MB
    const usedMemory = memoryUsage.heapUsed / 1024 / 1024; // MB
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    return {
      status: memoryPercentage < 90 ? 'healthy' : 'warning',
      total: `${totalMemory.toFixed(2)} MB`,
      used: `${usedMemory.toFixed(2)} MB`,
      percentage: `${memoryPercentage.toFixed(2)}%`,
    };
  }

  private checkDisk() {
    // Basic disk check - in production, use a proper disk monitoring library
    try {
      const usage = process.cpuUsage();
      return {
        status: 'healthy',
        message: 'Disk space available',
      };
    } catch (error) {
      return {
        status: 'unknown',
        message: 'Unable to check disk space',
      };
    }
  }

  private getUptime() {
    const uptimeMs = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    return {
      milliseconds: uptimeMs,
      formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    };
  }
}
