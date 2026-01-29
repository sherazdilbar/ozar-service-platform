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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jobs_service_1 = require("./jobs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("./dto");
const client_1 = require("@prisma/client");
let JobsController = class JobsController {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async createJob(req, dto) {
        return this.jobsService.createJob(req.user.userId, dto);
    }
    async getMyJobs(req, status) {
        return this.jobsService.findCustomerJobs(req.user.userId, status);
    }
    async getAvailableJobs(req, category) {
        const user = await this.jobsService['prisma'].user.findUnique({
            where: { id: req.user.userId },
            include: { proProfile: true },
        });
        if (!user?.proProfile) {
            throw new Error('Professional profile not found');
        }
        return this.jobsService.findAvailableJobs(user.proProfile.id, category);
    }
    async getJob(req, id) {
        return this.jobsService.findJobById(id, req.user.userId);
    }
    async updateJob(req, id, dto) {
        return this.jobsService.updateJob(id, req.user.userId, dto);
    }
    async cancelJob(req, id) {
        return this.jobsService.cancelJob(id, req.user.userId);
    }
    async createBid(req, dto) {
        const user = await this.jobsService['prisma'].user.findUnique({
            where: { id: req.user.userId },
            include: { proProfile: true },
        });
        if (!user?.proProfile) {
            throw new Error('Professional profile not found');
        }
        return this.jobsService.createBid(user.proProfile.id, dto);
    }
    async getMyBids(req, status) {
        const user = await this.jobsService['prisma'].user.findUnique({
            where: { id: req.user.userId },
            include: { proProfile: true },
        });
        if (!user?.proProfile) {
            throw new Error('Professional profile not found');
        }
        return this.jobsService.findProBids(user.proProfile.id, status);
    }
    async getBid(req, id) {
        return this.jobsService.findBidById(id, req.user.userId);
    }
    async updateBid(req, id, dto) {
        const user = await this.jobsService['prisma'].user.findUnique({
            where: { id: req.user.userId },
            include: { proProfile: true },
        });
        if (!user?.proProfile) {
            throw new Error('Professional profile not found');
        }
        return this.jobsService.updateBid(id, user.proProfile.id, dto);
    }
    async withdrawBid(req, id) {
        const user = await this.jobsService['prisma'].user.findUnique({
            where: { id: req.user.userId },
            include: { proProfile: true },
        });
        if (!user?.proProfile) {
            throw new Error('Professional profile not found');
        }
        return this.jobsService.withdrawBid(id, user.proProfile.id);
    }
    async acceptBid(req, id) {
        return this.jobsService.acceptBid(id, req.user.userId);
    }
    async rejectBid(req, id) {
        return this.jobsService.rejectBid(id, req.user.userId);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createJob", null);
__decorate([
    (0, common_1.Get)('my-jobs'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getMyJobs", null);
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getAvailableJobs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJob", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateJobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "cancelJob", null);
__decorate([
    (0, common_1.Post)('bids'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateBidDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createBid", null);
__decorate([
    (0, common_1.Get)('bids/my-bids'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getMyBids", null);
__decorate([
    (0, common_1.Get)('bids/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getBid", null);
__decorate([
    (0, common_1.Patch)('bids/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateBidDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateBid", null);
__decorate([
    (0, common_1.Post)('bids/:id/withdraw'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "withdrawBid", null);
__decorate([
    (0, common_1.Post)('bids/:id/accept'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "acceptBid", null);
__decorate([
    (0, common_1.Post)('bids/:id/reject'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "rejectBid", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map