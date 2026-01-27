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
exports.CertificationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const certifications_service_1 = require("./certifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CertificationsController = class CertificationsController {
    constructor(certificationsService, prisma) {
        this.certificationsService = certificationsService;
        this.prisma = prisma;
    }
    async getCertifications(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.certificationsService.getCertifications(proProfile.id);
    }
    async addCertification(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.certificationsService.addCertification(proProfile.id, body);
    }
    async updateCertification(req, id, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.certificationsService.updateCertification(proProfile.id, id, body);
    }
    async deleteCertification(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.certificationsService.deleteCertification(proProfile.id, id);
    }
    async getBadges(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.certificationsService.getBadges(proProfile.id);
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
exports.CertificationsController = CertificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "getCertifications", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "addCertification", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "updateCertification", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "deleteCertification", null);
__decorate([
    (0, common_1.Get)('badges'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "getBadges", null);
exports.CertificationsController = CertificationsController = __decorate([
    (0, common_1.Controller)('certifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [certifications_service_1.CertificationsService,
        prisma_service_1.PrismaService])
], CertificationsController);
//# sourceMappingURL=certifications.controller.js.map