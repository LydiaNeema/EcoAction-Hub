// src/components/profile/AchievementCard.js
export function AchievementCard({ name, icon, description, unlocked = true }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {unlocked && (
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Unlocked" />
        )}
      </div>
    </div>
  );
}