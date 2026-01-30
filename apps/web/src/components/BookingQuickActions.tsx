'use client';

import { MessageSquare, Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface BookingQuickActionsProps {
  bookingId: string;
  status: string;
  onMessage?: () => void;
  onCall?: () => void;
  onNavigate?: () => void;
  onReschedule?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  userRole: 'customer' | 'pro';
}

export default function BookingQuickActions({
  bookingId,
  status,
  onMessage,
  onCall,
  onNavigate,
  onReschedule,
  onComplete,
  onCancel,
  userRole,
}: BookingQuickActionsProps) {
  const canComplete = userRole === 'pro' && ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(status);
  const canCancel = ['REQUESTED', 'ACCEPTED', 'SCHEDULED'].includes(status);
  const canReschedule = ['ACCEPTED', 'SCHEDULED'].includes(status);

  return (
    <div className="grid grid-cols-2 gap-3">
      {onMessage && (
        <button
          onClick={onMessage}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
        >
          <MessageSquare className="w-5 h-5" />
          Message
        </button>
      )}

      {onCall && (
        <button
          onClick={onCall}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          <Phone className="w-5 h-5" />
          Call
        </button>
      )}

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
        >
          <MapPin className="w-5 h-5" />
          Navigate
        </button>
      )}

      {canReschedule && onReschedule && (
        <button
          onClick={onReschedule}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition"
        >
          <Calendar className="w-5 h-5" />
          Reschedule
        </button>
      )}

      {canComplete && onComplete && (
        <button
          onClick={onComplete}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition col-span-2"
        >
          <CheckCircle className="w-5 h-5" />
          Mark as Complete
        </button>
      )}

      {canCancel && onCancel && (
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition col-span-2"
        >
          <XCircle className="w-5 h-5" />
          Cancel Booking
        </button>
      )}
    </div>
  );
}
