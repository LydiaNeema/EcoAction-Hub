// src/components/profile/ActivityFeed.js
import { ActivityItem } from './ActivityItem';
import { Card, CardContent } from '@/components/ui/card';

export function ActivityFeed({ activities = [] }) {
  const defaultActivities = [
    {
      type: "report",
      title: "Reported flooding issue",
      location: "Downtown area",
      date: "Oct 10, 2025",
      status: "Active",
    },
    {
      type: "action",
      title: "Joined Beach Cleanup",
      location: "Marina Beach",
      date: "Oct 8, 2025",
      status: "Completed",
    },
    ...activities
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            {defaultActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                type={activity.type}
                title={activity.title}
                location={activity.location}
                date={activity.date}
                status={activity.status}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}