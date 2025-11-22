import React from 'react';

const Input = ({
    value,
    onChange,
    placeholder,
    type = "text",
    className = '',
    icon: Icon
}) => {
    return (
        <div className="relative w-full">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 ${Icon ? 'pl-12' : ''} ${className}`}
            />
        </div>
    );
};

export default Input;
