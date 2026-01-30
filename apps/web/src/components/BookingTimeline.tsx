'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

interface BookingTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  REQUESTED: { label: 'Requested', color: 'blue', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'green', icon: CheckCircle },
  SCHEDULED: { label: 'Scheduled', color: 'purple', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'orange', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'green', icon: CheckCircle },
  CANCELLED_BY_CUSTOMER: { label: 'Cancelled by Customer', color: 'red', icon: XCircle },
  CANCELLED_BY_PRO: { label: 'Cancelled by Pro', color: 'red', icon: XCircle },
};

export default function BookingTimeline({ events, currentStatus }: BookingTimelineProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = STATUS_CONFIG[event.status] || STATUS_CONFIG.REQUESTED;
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${config.color}-100 dark:bg-${config.color}-900/30`}>
                <Icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
              </div>
              {!isLast && (
                <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {config.label}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(event.timestamp).toLocaleString()}
              </p>
              {event.note && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
