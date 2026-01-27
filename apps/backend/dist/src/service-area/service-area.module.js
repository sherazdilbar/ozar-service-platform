"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceAreaModule = void 0;
const common_1 = require("@nestjs/common");
const service_area_controller_1 = require("./service-area.controller");
const service_area_service_1 = require("./service-area.service");
const prisma_module_1 = require("../prisma/prisma.module");
let ServiceAreaModule = class ServiceAreaModule {
};
exports.ServiceAreaModule = ServiceAreaModule;
exports.ServiceAreaModule = ServiceAreaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [service_area_controller_1.ServiceAreaController],
        providers: [service_area_service_1.ServiceAreaService],
        exports: [service_area_service_1.ServiceAreaService],
    })
], ServiceAreaModule);
//# sourceMappingURL=service-area.module.js.map