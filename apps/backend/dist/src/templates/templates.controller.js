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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const templates_service_1 = require("./templates.service");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesController = class TemplatesController {
    constructor(templatesService, prisma) {
        this.templatesService = templatesService;
        this.prisma = prisma;
    }
    async getResponseTemplates(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.getResponseTemplates(proProfile.id);
    }
    async createResponseTemplate(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.createResponseTemplate(proProfile.id, body);
    }
    async updateResponseTemplate(req, id, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.updateResponseTemplate(proProfile.id, id, body);
    }
    async deleteResponseTemplate(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.deleteResponseTemplate(proProfile.id, id);
    }
    async getAutoResponses(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.getAutoResponses(proProfile.id);
    }
    async createAutoResponse(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.createAutoResponse(proProfile.id, body);
    }
    async updateAutoResponse(req, id, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.updateAutoResponse(proProfile.id, id, body);
    }
    async deleteAutoResponse(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.deleteAutoResponse(proProfile.id, id);
    }
    async getQuickMessages(req) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.getQuickMessages(proProfile.id);
    }
    async createQuickMessage(req, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.createQuickMessage(proProfile.id, body);
    }
    async updateQuickMessage(req, id, body) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.updateQuickMessage(proProfile.id, id, body);
    }
    async deleteQuickMessage(req, id) {
        const proProfile = await this.getProProfile(req.user.id);
        return this.templatesService.deleteQuickMessage(proProfile.id, id);
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
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Get)('responses'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getResponseTemplates", null);
__decorate([
    (0, common_1.Post)('responses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createResponseTemplate", null);
__decorate([
    (0, common_1.Put)('responses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateResponseTemplate", null);
__decorate([
    (0, common_1.Delete)('responses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deleteResponseTemplate", null);
__decorate([
    (0, common_1.Get)('auto-responses'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getAutoResponses", null);
__decorate([
    (0, common_1.Post)('auto-responses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createAutoResponse", null);
__decorate([
    (0, common_1.Put)('auto-responses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateAutoResponse", null);
__decorate([
    (0, common_1.Delete)('auto-responses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deleteAutoResponse", null);
__decorate([
    (0, common_1.Get)('quick-messages'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getQuickMessages", null);
__decorate([
    (0, common_1.Post)('quick-messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createQuickMessage", null);
__decorate([
    (0, common_1.Put)('quick-messages/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateQuickMessage", null);
__decorate([
    (0, common_1.Delete)('quick-messages/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deleteQuickMessage", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        prisma_service_1.PrismaService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map