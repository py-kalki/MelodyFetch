import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full mt-12 py-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} MelodyFetch. All rights reserved.
                </div>

                <a
                    href="https://github.com/py-kalki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors duration-300 group"
                >
                    <span className="text-sm font-medium group-hover:underline decoration-green-400/50 underline-offset-4">
                        Created by py-kalki
                    </span>
                    <Github size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
