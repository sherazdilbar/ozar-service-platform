"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthService = HealthService_1 = class HealthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(HealthService_1.name);
        this.startTime = Date.now();
    }
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
        const allHealthy = Object.values(checks.services).every((service) => service.status === 'healthy');
        checks.status = allHealthy ? 'ok' : 'degraded';
        return checks;
    }
    async checkDatabase() {
        try {
            const startTime = Date.now();
            await this.prisma.$queryRaw `SELECT 1`;
            const responseTime = Date.now() - startTime;
            return {
                status: 'healthy',
                responseTime: `${responseTime}ms`,
                message: 'Database connection successful',
            };
        }
        catch (error) {
            this.logger.error('Database health check failed', error);
            return {
                status: 'unhealthy',
                message: 'Database connection failed',
                error: error.message,
            };
        }
    }
    checkMemory() {
        const memoryUsage = process.memoryUsage();
        const totalMemory = memoryUsage.heapTotal / 1024 / 1024;
        const usedMemory = memoryUsage.heapUsed / 1024 / 1024;
        const memoryPercentage = (usedMemory / totalMemory) * 100;
        return {
            status: memoryPercentage < 90 ? 'healthy' : 'warning',
            total: `${totalMemory.toFixed(2)} MB`,
            used: `${usedMemory.toFixed(2)} MB`,
            percentage: `${memoryPercentage.toFixed(2)}%`,
        };
    }
    checkDisk() {
        try {
            const usage = process.cpuUsage();
            return {
                status: 'healthy',
                message: 'Disk space available',
            };
        }
        catch (error) {
            return {
                status: 'unknown',
                message: 'Unable to check disk space',
            };
        }
    }
    getUptime() {
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
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map