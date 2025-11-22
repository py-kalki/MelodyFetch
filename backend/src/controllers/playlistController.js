const spotifyService = require('../services/spotifyService');
const downloadService = require('../services/downloadService');
const zipService = require('../services/zipService');
// const { v4: uuidv4 } = require('uuid'); // Removed as we use crypto
const crypto = require('crypto');

// Helper for UUID since I didn't add uuid to package.json (my bad, using crypto)
function generateId() {
    return crypto.randomUUID();
}

exports.parsePlaylist = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        // Extract ID from URL
        // https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
        const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
        if (!match) return res.status(400).json({ error: 'Invalid Spotify Playlist URL' });

        const playlistId = match[1];
        const data = await spotifyService.getPlaylistTracks(playlistId);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
};

exports.processPlaylist = async (req, res) => {
    const { playlistId, tracks, playlistName } = req.body; // tracks is array of full track objects
    const jobId = generateId();

    // Return immediately
    res.json({ jobId });

    // Start processing in background
    const io = req.app.get('io');

    processJob(jobId, tracks, playlistName, io);
};



async function processJob(jobId, tracks, playlistName, io) {
    try {
        await downloadService.checkPrerequisites();
    } catch (error) {
        console.error(`Prerequisite check failed:`, error);
        io.to(jobId).emit('error', { message: error.message });
        return;
    }

    const results = [];
    let completed = 0;
    const total = tracks.length;

    try {
        // Process in chunks to avoid overwhelming server/network
        // Concurrency limit: 3
        const CONCURRENCY = 3;

        for (let i = 0; i < tracks.length; i += CONCURRENCY) {
            const chunk = tracks.slice(i, i + CONCURRENCY);
            const chunkPromises = chunk.map(track =>
                downloadService.downloadTrack(track, jobId).then(result => {
                    completed++;
                    io.to(jobId).emit('progress', {
                        percent: Math.round((completed / total) * 90), // 90% is download, 10% zip
                        currentTrack: track.title,
                        status: 'downloading'
                    });
                    return result;
                })
            );

            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);
        }

        // Check if we have any successful downloads
        const successfulDownloads = results.filter(r => r && r.success);

        if (successfulDownloads.length === 0) {
            io.to(jobId).emit('error', { message: 'No tracks were downloaded successfully. Check server logs.' });
            return;
        }

        io.to(jobId).emit('progress', { percent: 95, status: 'zipping' });

        const zipPath = await zipService.createZip(jobId, playlistName, successfulDownloads);

        io.to(jobId).emit('complete', {
            downloadUrl: `/api/v1/download/${jobId}/${path.basename(zipPath)}`
        });

    } catch (error) {
        console.error(`Job ${jobId} failed:`, error);
        io.to(jobId).emit('error', { message: 'Processing failed' });
    }
}

const path = require('path');
