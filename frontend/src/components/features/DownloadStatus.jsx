import React from 'react';
import { Download, CheckCircle, Music } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';

const DownloadStatus = ({ progress, status, currentTrack, downloadUrl, onReset }) => {
    const isComplete = status === 'complete' || (progress === 100 && downloadUrl);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="text-center space-y-8">
                <div className="relative w-24 h-24 mx-auto">
                    {isComplete ? (
                        <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                            <Music className="w-10 h-10 text-green-400 animate-spin-slow" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                        {isComplete ? "Your Playlist is Ready!" : "Converting Tracks..."}
                    </h2>
                    <p className="text-gray-400">
                        {isComplete
                            ? "Download your ZIP file below."
                            : `Processing: ${currentTrack || 'Initializing...'}`}
                    </p>
                </div>

                {!isComplete && (
                    <ProgressBar progress={progress} status={status} />
                )}

                {isComplete && (
                    <div className="space-y-4">
                        <a href={downloadUrl} download>
                            <Button className="w-full text-lg py-4">
                                <Download className="w-6 h-6" />
                                Download ZIP
                            </Button>
                        </a>
                        <button
                            onClick={onReset}
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            Convert Another Playlist
                        </button>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default DownloadStatus;
