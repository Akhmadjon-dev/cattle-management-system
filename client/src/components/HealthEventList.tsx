import { formatDate } from '../utils/formatters';
import type { HealthEvent } from '@shared/type';

interface HealthEventListProps {
  events: HealthEvent[];
}

const getEventColor = (type: string): string => {
  switch (type) {
    case 'vaccination':
      return 'bg-blue-50 border-blue-200';
    case 'treatment':
      return 'bg-yellow-50 border-yellow-200';
    case 'checkup':
      return 'bg-green-50 border-green-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const getEventIcon = (type: string): string => {
  switch (type) {
    case 'vaccination':
      return '💉';
    case 'treatment':
      return '⚕️';
    case 'checkup':
      return '🔍';
    default:
      return '📋';
  }
};

export default function HealthEventList({ events }: HealthEventListProps) {
  if (events.length === 0) {
    return <div className="text-center py-8 text-gray-500">No health events recorded yet</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className={`border rounded-lg p-4 ${getEventColor(event.type)}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getEventIcon(event.type)}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {event.type}
                  </h4>
                  <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                </div>
              </div>
              {event.notes && (
                <p className="text-sm text-gray-700 mt-2">{event.notes}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
