import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    className = ''
}) => {
    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
        outline: "border-2 border-green-500 text-green-400 hover:bg-green-500/10"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
