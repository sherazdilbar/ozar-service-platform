"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStateMachineService = void 0;
const common_1 = require("@nestjs/common");
let BookingStateMachineService = class BookingStateMachineService {
    constructor() {
        this.transitions = {
            DRAFT: ['REQUESTED'],
            REQUESTED: ['ACCEPTED', 'CANCELLED_BY_PRO', 'CANCELLED_BY_CUSTOMER'],
            OFFERED: ['ACCEPTED', 'CANCELLED_BY_PRO', 'CANCELLED_BY_CUSTOMER'],
            ACCEPTED: ['PAYMENT_AUTHORIZED', 'SCHEDULED', 'IN_PROGRESS', 'CANCELLED_BY_PRO', 'CANCELLED_BY_CUSTOMER'],
            PAYMENT_AUTHORIZED: ['SCHEDULED', 'REFUNDED'],
            SCHEDULED: ['IN_PROGRESS', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PRO', 'NO_SHOW'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED_BY_PRO'],
            COMPLETED: ['CAPTURED', 'DISPUTED'],
            CAPTURED: [],
            CANCELLED_BY_CUSTOMER: ['REFUNDED'],
            CANCELLED_BY_PRO: ['REFUNDED'],
            NO_SHOW: ['REFUNDED', 'CAPTURED'],
            DISPUTED: ['REFUNDED', 'CAPTURED'],
            REFUNDED: [],
        };
        this.requiresReason = [
            'CANCELLED_BY_CUSTOMER',
            'CANCELLED_BY_PRO',
            'DISPUTED',
            'REFUNDED',
            'NO_SHOW',
        ];
        this.terminalStatuses = [
            'CAPTURED',
            'REFUNDED',
        ];
    }
    validateTransition(currentStatus, newStatus, reason) {
        if (this.isTerminal(currentStatus)) {
            throw new common_1.BadRequestException(`Cannot transition from terminal status ${currentStatus}`);
        }
        const allowedTransitions = this.transitions[currentStatus] || [];
        if (!allowedTransitions.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid transition from ${currentStatus} to ${newStatus}. ` +
                `Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`);
        }
        if (this.requiresReason.includes(newStatus) && !reason?.trim()) {
            throw new common_1.BadRequestException(`Reason is required for status ${newStatus}`);
        }
    }
    isTerminal(status) {
        return this.terminalStatuses.includes(status);
    }
    isCancellation(status) {
        return [
            'CANCELLED_BY_CUSTOMER',
            'CANCELLED_BY_PRO',
            'NO_SHOW',
        ].includes(status);
    }
    isActive(status) {
        return [
            'REQUESTED',
            'OFFERED',
            'ACCEPTED',
            'PAYMENT_AUTHORIZED',
            'SCHEDULED',
            'IN_PROGRESS',
        ].includes(status);
    }
    getAllowedTransitions(currentStatus) {
        return this.transitions[currentStatus] || [];
    }
    getStatusLabel(status) {
        const labels = {
            DRAFT: 'Draft',
            REQUESTED: 'Pending Approval',
            OFFERED: 'Offer Sent',
            ACCEPTED: 'Accepted',
            PAYMENT_AUTHORIZED: 'Payment Authorized',
            SCHEDULED: 'Scheduled',
            IN_PROGRESS: 'In Progress',
            COMPLETED: 'Completed',
            CAPTURED: 'Payment Captured',
            CANCELLED_BY_CUSTOMER: 'Cancelled by Customer',
            CANCELLED_BY_PRO: 'Cancelled by Professional',
            NO_SHOW: 'No Show',
            DISPUTED: 'Disputed',
            REFUNDED: 'Refunded',
        };
        return labels[status] || status;
    }
    canUserTransition(userRole, currentStatus, newStatus) {
        if (userRole === 'CUSTOMER' && newStatus === 'CANCELLED_BY_CUSTOMER') {
            return ['REQUESTED', 'ACCEPTED', 'PAYMENT_AUTHORIZED', 'SCHEDULED'].includes(currentStatus);
        }
        if (userRole === 'PRO') {
            if (currentStatus === 'REQUESTED') {
                return ['ACCEPTED', 'CANCELLED_BY_PRO'].includes(newStatus);
            }
            if (newStatus === 'CANCELLED_BY_PRO') {
                return ['ACCEPTED', 'PAYMENT_AUTHORIZED', 'SCHEDULED'].includes(currentStatus);
            }
            if (newStatus === 'IN_PROGRESS') {
                return ['ACCEPTED', 'SCHEDULED'].includes(currentStatus);
            }
            if (currentStatus === 'IN_PROGRESS' && newStatus === 'COMPLETED') {
                return true;
            }
        }
        if (userRole === 'ADMIN') {
            return this.getAllowedTransitions(currentStatus).includes(newStatus);
        }
        return false;
    }
};
exports.BookingStateMachineService = BookingStateMachineService;
exports.BookingStateMachineService = BookingStateMachineService = __decorate([
    (0, common_1.Injectable)()
], BookingStateMachineService);
//# sourceMappingURL=booking-state-machine.service.js.map