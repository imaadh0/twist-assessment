'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="space-y-1">
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-50 disabled:text-gray-500
                        ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-400'
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
