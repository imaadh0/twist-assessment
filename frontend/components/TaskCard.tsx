'use client';

import { Task } from '@/types';
import Badge from './ui/Badge';

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className={`group bg-white rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${task.completed ? 'opacity-60 bg-gray-50' : ''
            } ${isOverdue ? 'border-red-200 ring-1 ring-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start gap-4">
                {/* checkbox */}
                <button
                    onClick={() => onToggle(task)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${task.completed
                        ? 'bg-blue-600 border-blue-600 scale-100'
                        : 'border-gray-300 hover:border-blue-400 bg-white'
                        }`}
                    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    {task.completed && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                {/* content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`font-medium text-gray-900 text-lg leading-tight ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h3>
                        {isOverdue && <Badge variant="high">Overdue</Badge>}
                        <Badge variant={task.priority}>{task.priority}</Badge>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                        {task.dueDate && (
                            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(task.dueDate)}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(task.createdAt)}
                        </span>
                    </div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                    <button
                        onClick={() => onEdit(task.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Edit task"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Delete task"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
