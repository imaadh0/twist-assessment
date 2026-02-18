export function validateEmail(email: string): string | null {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Enter a valid email';
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
    if (!/[0-9]/.test(password)) return 'Must contain a number';
    return null;
}

export function validateTaskTitle(title: string): string | null {
    if (!title.trim()) return 'Title is required';
    if (title.length > 200) return 'Title must be under 200 characters';
    return null;
}
