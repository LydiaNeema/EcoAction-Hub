export const dashboardData = {
  user: {
    name: "Lydia",
    stats: {
      issuesReported: 12,
      actionsJoined: 8,
      communityImpact: 452,
      treesPlanted: 24
    }
  },
  aiInsights: [
    {
      id: 1,
      title: "Flood Risk Increasing",
      description: "Heavy rainfall predicted for this week. 3 flood reports in your area this month.",
      icon: "Droplets",
      type: "alert",
      color: "red",
      buttonText: "View Details"
    },
    {
      id: 2,
      title: "Heat Wave Advisory",
      description: "Temperature expected to reach 95°F+ this weekend. Stay hydrated and check on neighbors.",
      icon: "Flame",
      type: "alert",
      color: "orange",
      buttonText: "View Safety Tips"
    },
    {
      id: 3,
      title: "Tree Planting Event",
      description: "Join 45 community members this Saturday to plant 100 trees in Riverside Park.",
      icon: "Users",
      type: "event",
      color: "blue",
      buttonText: "Join Event"
    },
    {
      id: 4,
      title: "Air Quality Improving",
      description: "Thanks to community efforts, air quality in your area has improved by 15% this quarter.",
      icon: "Wind",
      type: "positive",
      color: "green",
      buttonText: "Learn More"
    }
  ],
  recentActivities: [
    {
      id: 1,
      type: "report",
      title: "Sarah M. reported a flooding issue",
      description: "Downtown area near 5th Street - Storm drain overflow",
      time: "2h ago",
      icon: "FileText"
    },
    {
      id: 2,
      type: "community",
      title: "22 people joined Beach Cleanup",
      description: "Marina Beach - Saturday 9 AM",
      time: "5h ago",
      icon: "Users"
    },
    {
      id: 3,
      type: "alert",
      title: "Heat Advisory issued",
      description: "Your area - Expected 95°F+ this weekend",
      time: "1d ago",
      icon: "AlertTriangle"
    }
  ]
};