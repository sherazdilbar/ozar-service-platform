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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const availability_service_1 = require("./availability.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AvailabilityController = class AvailabilityController {
    constructor(availabilityService, prisma) {
        this.availabilityService = availabilityService;
        this.prisma = prisma;
    }
    async getSchedule(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.availabilityService.getSchedule(proProfile.id);
    }
    async updateSchedule(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.availabilityService.updateSchedule(proProfile.id, body.schedules);
    }
    async getTimeOffs(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.availabilityService.getTimeOffs(proProfile.id);
    }
    async addTimeOff(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.availabilityService.addTimeOff(proProfile.id, body);
    }
    async deleteTimeOff(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.availabilityService.deleteTimeOff(proProfile.id, id);
    }
    async getProProfile(userId) {
        const profile = await this.prisma.proProfile.findFirst({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Pro profile not found');
        }
        return profile;
    }
};
exports.AvailabilityController = AvailabilityController;
__decorate([
    (0, common_1.Get)('schedule'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Put)('schedule'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Get)('time-off'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getTimeOffs", null);
__decorate([
    (0, common_1.Post)('time-off'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "addTimeOff", null);
__decorate([
    (0, common_1.Delete)('time-off/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "deleteTimeOff", null);
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, common_1.Controller)('availability'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService,
        prisma_service_1.PrismaService])
], AvailabilityController);
//# sourceMappingURL=availability.controller.js.map