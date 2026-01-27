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
exports.ServiceAreaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const service_area_service_1 = require("./service-area.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ServiceAreaController = class ServiceAreaController {
    constructor(serviceAreaService, prisma) {
        this.serviceAreaService = serviceAreaService;
        this.prisma = prisma;
    }
    async getServiceAreas(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.serviceAreaService.getServiceAreas(proProfile.id);
    }
    async addServiceArea(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.serviceAreaService.addServiceArea(proProfile.id, body);
    }
    async updateServiceArea(req, id, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.serviceAreaService.updateServiceArea(proProfile.id, id, body);
    }
    async deleteServiceArea(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.serviceAreaService.deleteServiceArea(proProfile.id, id);
    }
    calculateTravelFee(distance) {
        const dist = parseFloat(distance);
        const fee = this.serviceAreaService.calculateTravelFee(dist);
        return { distance: dist, travelFee: fee };
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
exports.ServiceAreaController = ServiceAreaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "getServiceAreas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "addServiceArea", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "updateServiceArea", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "deleteServiceArea", null);
__decorate([
    (0, common_1.Get)('calculate-travel-fee'),
    __param(0, (0, common_1.Query)('distance')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceAreaController.prototype, "calculateTravelFee", null);
exports.ServiceAreaController = ServiceAreaController = __decorate([
    (0, common_1.Controller)('service-areas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [service_area_service_1.ServiceAreaService,
        prisma_service_1.PrismaService])
], ServiceAreaController);
//# sourceMappingURL=service-area.controller.js.map