'use client';

import { TaskStats as Stats } from '@/types';

interface TaskStatsProps {
    stats: Stats | null;
}

export default function TaskStats({ stats }: TaskStatsProps) {
    if (!stats) return null;

    const statCards = [
        { label: 'Total Tasks', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
        { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700 border-green-100' },
        { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
        { label: 'Overdue', value: stats.overdue, color: 'bg-red-50 text-red-700 border-red-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${card.color}`}>
                        <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                        <p className="text-sm font-medium opacity-80 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* completion bar */}
            {stats.total > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Completion Progress</span>
                        <span className="text-sm font-bold text-gray-900">{stats.completionRate}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
