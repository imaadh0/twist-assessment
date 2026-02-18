'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task, TaskStats as Stats } from '@/types';
import TaskCard from '@/components/TaskCard';
import TaskStatsComponent from '@/components/TaskStats';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    // delete modal state
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; taskId: string | null }>({
        isOpen: false,
        taskId: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            setError('');
            const [tasksRes, statsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/tasks/stats'),
            ]);
            setTasks(tasksRes.data.data);
            setStats(statsRes.data.data);
        } catch {
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = async (task: Task) => {
        try {
            await api.put(`/tasks/${task.id}`, { completed: !task.completed });
            fetchData();
        } catch {
            setError('Failed to update task.');
        }
    };

    const openDeleteModal = (id: string) => {
        setDeleteModal({ isOpen: true, taskId: id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, taskId: null });
    };

    const confirmDelete = async () => {
        if (!deleteModal.taskId) return;

        setIsDeleting(true);
        try {
            await api.delete(`/tasks/${deleteModal.taskId}`);
            closeDeleteModal();
            fetchData();
        } catch {
            setError('Failed to delete task.');
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/tasks/${id}/edit`);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* delete confirmation modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                isDanger
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
            />

            {/* stats */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TaskStatsComponent stats={stats} />
            </div>

            <div className="space-y-6">
                {/* header & filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-[72px] bg-gray-50/90 backdrop-blur-sm py-2 z-40 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-start sm:self-auto">
                        {(['all', 'pending', 'completed'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === f
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <Button onClick={() => router.push('/dashboard/tasks/new')} className="shadow-md hover:shadow-lg transition-shadow">
                        <span className="mr-2 text-lg leading-none">+</span> New Task
                    </Button>
                </div>

                {/* error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* task list */}
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            {filter === 'all'
                                ? "You haven't created any tasks yet. Get started by adding a new task to your list."
                                : `No ${filter} tasks found. Try changing your filter or add a new task.`}
                        </p>
                        {filter === 'all' && (
                            <div className="mt-6">
                                <Button onClick={() => router.push('/dashboard/tasks/new')} variant="secondary">
                                    Create Task
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 animate-in fade-in duration-500">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onEdit={handleEdit}
                                onDelete={openDeleteModal}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
