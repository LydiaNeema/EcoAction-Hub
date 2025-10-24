// src/components/profile/AchievementsGrid.js
import { AchievementCard } from './AchievementCard';

export function AchievementsGrid({ achievements = [] }) {
  const defaultAchievements = [
    { name: "Early Adopter", description: "Joined in the first month" },
    { name: "Tree Champion", description: "Planted 20+ trees" },
    { name: "Community Leader", description: "Joined 5+ actions" },
    { name: "Alert Hero", description: "Responded to 5 emergencies" },
    ...achievements
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultAchievements.map((achievement, index) => (
          <AchievementCard
            key={index}
            name={achievement.name}
            description={achievement.description}
            unlocked={achievement.unlocked !== false}
          />
        ))}
      </div>
    </div>
  );
}