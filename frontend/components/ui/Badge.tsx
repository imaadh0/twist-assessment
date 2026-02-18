interface BadgeProps {
    children: React.ReactNode;
    variant?: 'low' | 'medium' | 'high' | 'default';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
    const variants = {
        low: 'bg-green-100 text-green-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-red-100 text-red-700',
        default: 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
}
