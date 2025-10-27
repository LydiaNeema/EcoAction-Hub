// src/components/profile/StatCard.js
export function StatCard({ icon: Icon, label, value, color = "text-gray-600" }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}