'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import Spinner from '@/components/ui/Spinner';
import { Task } from '@/types';

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const { data } = await api.get(`/tasks/${id}`);
                setTask(data.data);
            } catch {
                setError('Task not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleSubmit = async (data: { title: string; description: string; priority: string; dueDate: string }) => {
        setSubmitting(true);
        setError('');
        try {
            await api.put(`/tasks/${id}`, {
                title: data.title,
                description: data.description || undefined,
                priority: data.priority,
                dueDate: data.dueDate || null,
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update task.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner size="lg" />;

    if (!task) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{error || 'Task not found'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Task</h1>
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <TaskForm
                    initialData={task}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/dashboard')}
                    isSubmitting={submitting}
                />
            </div>
        </div>
    );
}
