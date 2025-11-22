import React, { useState } from 'react';
import { Link2, Music } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

const PlaylistInput = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSubmit(url);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="text-center space-y-6">
                <div className="space-y-2">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Import Spotify Playlist
                    </h2>
                    <p className="text-gray-400">
                        Paste your public playlist link below to start fetching tracks.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://open.spotify.com/playlist/..."
                        icon={Link2}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={!url}
                    >
                        Fetch Tracks
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
};

export default PlaylistInput;
