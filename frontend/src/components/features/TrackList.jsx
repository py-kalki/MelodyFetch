import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const TrackList = ({ tracks, onProcess, isProcessing }) => {
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                    Found {tracks.length} Tracks
                </h3>
                <Button onClick={onProcess} isLoading={isProcessing}>
                    Start Conversion
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                            <tr className="text-gray-400 text-sm">
                                <th className="p-4">#</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Artist</th>
                                <th className="p-4">Album</th>
                                <th className="p-4"><Clock className="w-4 h-4" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tracks.map((track, index) => (
                                <tr key={track.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-500">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {track.cover && (
                                                <img
                                                    src={track.cover}
                                                    alt={track.title}
                                                    className="w-10 h-10 rounded-md object-cover"
                                                />
                                            )}
                                            <span className="font-medium text-white">{track.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400">{track.artist}</td>
                                    <td className="p-4 text-gray-400">{track.album}</td>
                                    <td className="p-4 text-gray-400">{formatDuration(track.duration)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default TrackList;
