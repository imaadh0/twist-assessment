'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (data: { title: string; description: string; priority: string; dueDate: string }) => {
        setSubmitting(true);
        setError('');
        try {
            await api.post('/tasks', {
                title: data.title,
                description: data.description || undefined,
                priority: data.priority,
                dueDate: data.dueDate || undefined,
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create task.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h1>
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <TaskForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/dashboard')}
                    isSubmitting={submitting}
                />
            </div>
        </div>
    );
}
