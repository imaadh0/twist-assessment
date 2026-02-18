'use client';

import { useState, FormEvent } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { validateTaskTitle } from '@/lib/validators';
import { Task } from '@/types';

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: {
        title: string;
        description: string;
        priority: string;
        dueDate: string;
    }) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function TaskForm({ initialData, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');
    const [dueDate, setDueDate] = useState(
        initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
    );
    const [errors, setErrors] = useState<{ title?: string | null }>({});

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const titleError = validateTaskTitle(title);
        if (titleError) {
            setErrors({ title: titleError });
            return;
        }
        setErrors({});
        await onSubmit({ title, description, priority, dueDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                placeholder="What needs to be done?"
                required
            />

            <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Add some details..."
                    maxLength={2000}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <Input
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={isSubmitting}>
                    {initialData ? 'Update Task' : 'Create Task'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
