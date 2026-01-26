import { BookingStatus } from '@prisma/client';
export declare class BookingStateMachineService {
    private readonly transitions;
    private readonly requiresReason;
    private readonly terminalStatuses;
    validateTransition(currentStatus: BookingStatus, newStatus: BookingStatus, reason?: string): void;
    isTerminal(status: BookingStatus): boolean;
    isCancellation(status: BookingStatus): boolean;
    isActive(status: BookingStatus): boolean;
    getAllowedTransitions(currentStatus: BookingStatus): BookingStatus[];
    getStatusLabel(status: BookingStatus): string;
    canUserTransition(userRole: string, currentStatus: BookingStatus, newStatus: BookingStatus): boolean;
}
