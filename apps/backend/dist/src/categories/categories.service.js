"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ozar/shared");
const client_1 = require("@prisma/client");
let CategoriesService = class CategoriesService {
    getAll() {
        return Object.values(client_1.ServiceCategory).map(category => ({
            id: category,
            label: shared_1.CATEGORY_LABELS[category],
            icon: shared_1.CATEGORY_ICONS[category],
        }));
    }
    getGrouped() {
        return shared_1.CATEGORY_GROUPS.map(group => ({
            id: group.id,
            label: group.label,
            icon: group.icon,
            description: group.description,
            subcategories: group.subcategories.map(cat => ({
                id: cat,
                label: shared_1.CATEGORY_LABELS[cat],
                icon: shared_1.CATEGORY_ICONS[cat],
            })),
        }));
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)()
], CategoriesService);
//# sourceMappingURL=categories.service.js.map