// src/components/profile/StatsGrid.js
import { FileText, Users, AlertTriangle, Award } from 'lucide-react';
import { StatCard } from './StatCard';

export function StatsGrid({ stats }) {
  const statItems = [
    { 
      icon: FileText, 
      label: "Issues Reported", 
      value: stats?.issues_reported || 12, 
      color: "text-gray-600" 
    },
    { 
      icon: Users, 
      label: "Actions Joined", 
      value: stats?.actions_joined || 8, 
      color: "text-blue-600" 
    },
    { 
      icon: AlertTriangle, 
      label: "Alerts Responded", 
      value: stats?.alerts_responded || 452, 
      color: "text-yellow-600" 
    },
    { 
      icon: Award, 
      label: "Impact Points", 
      value: stats?.impact_points || 452, 
      color: "text-orange-600" 
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
}