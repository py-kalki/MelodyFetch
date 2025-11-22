import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, status }) => {
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
                <span>{status}</span>
                <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
                />
            </div>
        </div>
    );
};

export default ProgressBar;
