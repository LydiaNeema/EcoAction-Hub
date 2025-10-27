// src/components/profile/ActivityItem.js
import { FileText, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ActivityItem({ type, title, location, date, status }) {
  const isCompleted = status === "Completed" || status === "Resolved";
  
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-200 last:border-0">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
        {type === "report" ? (
          <FileText className="w-5 h-5 text-gray-900" />
        ) : (
          <Users className="w-5 h-5 text-gray-900" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-foreground">{title}</span>
          <Badge
            variant="outline"
            className={
              isCompleted
                ? "bg-gray-100 text-gray-900 border-gray-300"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {location} • {date}
        </p>
      </div>
    </div>
  );
}