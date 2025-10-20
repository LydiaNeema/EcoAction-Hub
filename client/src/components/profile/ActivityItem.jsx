// src/components/profile/ActivityItem.js
import { FileText, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ActivityItem({ type, title, location, date, status }) {
  const isCompleted = status === "Completed" || status === "Resolved";
  
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        type === "report" ? "bg-primary/10" : "bg-accent/10"
      }`}>
        {type === "report" ? (
          <FileText className="w-5 h-5 text-primary" />
        ) : (
          <Users className="w-5 h-5 text-accent" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-foreground">{title}</span>
          <Badge
            variant="outline"
            className={
              isCompleted
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground"
            }
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {location} • {date}
        </p>
      </div>
    </div>
  );
}