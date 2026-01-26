import { Injectable, BadRequestException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

/**
 * Booking State Machine Service
 * 
 * Centralized validation for all booking state transitions.
 * Ensures business rules are enforced consistently.
 */
@Injectable()
export class BookingStateMachineService {
  /**
   * Valid state transitions map
   * Key: current status
   * Value: array of allowed next statuses
   */
  private readonly transitions: Record<BookingStatus, BookingStatus[]> = {
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

  /**
   * Statuses that require a reason/note
   */
  private readonly requiresReason: BookingStatus[] = [
    'CANCELLED_BY_CUSTOMER',
    'CANCELLED_BY_PRO',
    'DISPUTED',
    'REFUNDED',
    'NO_SHOW',
  ];

  /**
   * Terminal statuses (no further transitions allowed)
   */
  private readonly terminalStatuses: BookingStatus[] = [
    'CAPTURED',
    'REFUNDED',
  ];

  /**
   * Validate if a state transition is allowed
   * @throws BadRequestException if transition is invalid
   */
  validateTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus,
    reason?: string,
  ): void {
    // Check if current status is terminal
    if (this.isTerminal(currentStatus)) {
      throw new BadRequestException(
        `Cannot transition from terminal status ${currentStatus}`,
      );
    }

    // Check if transition is allowed
    const allowedTransitions = this.transitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`,
      );
    }

    // Check if reason is required
    if (this.requiresReason.includes(newStatus) && !reason?.trim()) {
      throw new BadRequestException(
        `Reason is required for status ${newStatus}`,
      );
    }
  }

  /**
   * Check if a status is terminal (no further transitions)
   */
  isTerminal(status: BookingStatus): boolean {
    return this.terminalStatuses.includes(status);
  }

  /**
   * Check if a status is cancellation
   */
  isCancellation(status: BookingStatus): boolean {
    return [
      'CANCELLED_BY_CUSTOMER',
      'CANCELLED_BY_PRO',
      'NO_SHOW',
    ].includes(status);
  }

  /**
   * Check if a status is active (booking is ongoing)
   */
  isActive(status: BookingStatus): boolean {
    return [
      'REQUESTED',
      'OFFERED',
      'ACCEPTED',
      'PAYMENT_AUTHORIZED',
      'SCHEDULED',
      'IN_PROGRESS',
    ].includes(status);
  }

  /**
   * Get all allowed next statuses for current status
   */
  getAllowedTransitions(currentStatus: BookingStatus): BookingStatus[] {
    return this.transitions[currentStatus] || [];
  }

  /**
   * Get human-readable status label
   */
  getStatusLabel(status: BookingStatus): string {
    const labels: Record<BookingStatus, string> = {
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

  /**
   * Check if user can perform transition based on role
   */
  canUserTransition(
    userRole: string,
    currentStatus: BookingStatus,
    newStatus: BookingStatus,
  ): boolean {
    // Customers can cancel before IN_PROGRESS
    if (userRole === 'CUSTOMER' && newStatus === 'CANCELLED_BY_CUSTOMER') {
      return ['REQUESTED', 'ACCEPTED', 'PAYMENT_AUTHORIZED', 'SCHEDULED'].includes(currentStatus);
    }

    // Pros can accept/decline requests
    if (userRole === 'PRO') {
      if (currentStatus === 'REQUESTED') {
        return ['ACCEPTED', 'CANCELLED_BY_PRO'].includes(newStatus);
      }
      // Pros can cancel before IN_PROGRESS
      if (newStatus === 'CANCELLED_BY_PRO') {
        return ['ACCEPTED', 'PAYMENT_AUTHORIZED', 'SCHEDULED'].includes(currentStatus);
      }
      // Pros can start job from ACCEPTED or SCHEDULED
      if (newStatus === 'IN_PROGRESS') {
        return ['ACCEPTED', 'SCHEDULED'].includes(currentStatus);
      }
      // Pros can mark as COMPLETED from IN_PROGRESS
      if (currentStatus === 'IN_PROGRESS' && newStatus === 'COMPLETED') {
        return true;
      }
    }

    // Admins can do anything (except violate state machine)
    if (userRole === 'ADMIN') {
      return this.getAllowedTransitions(currentStatus).includes(newStatus);
    }

    return false;
  }
}
