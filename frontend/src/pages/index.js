import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import PlaylistInput from '@/components/features/PlaylistInput';
import TrackList from '@/components/features/TrackList';
import DownloadStatus from '@/components/features/DownloadStatus';
import Footer from '@/components/ui/Footer';
import api from '@/utils/api';

let socket;

export default function Home() {
  const [step, setStep] = useState('input'); // input, review, processing, complete
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');

  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Socket.io
    socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('progress', (data) => {
      setProgress(data.percent);
      setStatus(data.status);
      if (data.currentTrack) setCurrentTrack(data.currentTrack);
    });

    socket.on('complete', (data) => {
      setDownloadUrl(`http://localhost:3001${data.downloadUrl}`);
      setStatus('complete');
      setProgress(100);
      setStep('complete');
    });

    socket.on('error', (data) => {
      console.error('Job error:', data);
      setError(data.message || 'An error occurred during processing.');
      setStep('input');
      setIsLoading(false);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleFetchPlaylist = async (url) => {
    setIsLoading(true);
    try {
      const response = await api.post('/playlist/parse', { url });
      setPlaylist(response.data);
      setStep('review');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch playlist. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartProcess = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/playlist/process', {
        playlistId: 'temp', // Not strictly needed if we pass tracks
        tracks: playlist.tracks,
        playlistName: playlist.name
      });

      const newJobId = response.data.jobId;
      setJobId(newJobId);
      socket.emit('join_job', newJobId);

      setStep('processing');
    } catch (error) {
      console.error(error);
      alert('Failed to start processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setPlaylist(null);
    setProgress(0);
    setStatus('');
    setDownloadUrl('');

    setJobId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>MelodyFetch - Move your music anywhere</title>
        <meta name="description" content="Convert Spotify playlists to MP3 zip files" />
      </Head>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
            MelodyFetch
          </h1>
          <p className="text-xl text-gray-400">
            Move your music anywhere. No limits.
          </p>
        </header>

        <main className="w-full">
          {error && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {step === 'input' && (
            <PlaylistInput onSubmit={handleFetchPlaylist} isLoading={isLoading} />
          )}

          {step === 'review' && playlist && (
            <TrackList
              tracks={playlist.tracks}
              onProcess={handleStartProcess}
              isProcessing={isLoading}
            />
          )}

          {(step === 'processing' || step === 'complete') && (
            <DownloadStatus
              progress={progress}
              status={status}
              currentTrack={currentTrack}
              downloadUrl={downloadUrl}
              onReset={handleReset}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
