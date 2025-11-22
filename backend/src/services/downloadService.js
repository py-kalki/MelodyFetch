const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure downloads directory exists
const DOWNLOAD_DIR = path.join(__dirname, '../../downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function downloadTrack(track, jobId) {
    return new Promise((resolve, reject) => {
        const query = `${track.title} ${track.artist} official audio`;
        // Sanitize filename
        const safeTitle = track.title.replace(/[^a-z0-9]/gi, '_');
        const safeArtist = track.artist.replace(/[^a-z0-9]/gi, '_');
        const filename = `${safeTitle} - ${safeArtist}`;

        // Create job-specific directory
        const jobDir = path.join(DOWNLOAD_DIR, jobId);
        if (!fs.existsSync(jobDir)) {
            fs.mkdirSync(jobDir, { recursive: true });
        }

        const outputPath = path.join(jobDir, `${filename}.%(ext)s`);

        // Command: Search 1 result, extract audio, convert to mp3, embed metadata
        // Added --no-playlist to ensure we don't download a whole playlist if search hits one
        // Use local yt-dlp binary
        const ytDlpPath = path.join(__dirname, '../../bin/yt-dlp.exe');
        const command = `"${ytDlpPath}" "ytsearch1:${query}" -x --audio-format mp3 --add-metadata --embed-thumbnail --no-playlist -o "${outputPath}"`;

        console.log(`Starting download for: ${track.title}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading ${track.title}:`, error);
                // We resolve with null instead of rejecting to allow other downloads to continue
                resolve({ trackId: track.id, success: false, error: error.message });
            } else {
                console.log(`Finished download for: ${track.title}`);
                resolve({
                    trackId: track.id,
                    success: true,
                    path: path.join(jobDir, `${filename}.mp3`)
                });
            }
        });
    });

}

function checkPrerequisites() {
    return new Promise((resolve, reject) => {
        const ytDlpPath = path.join(__dirname, '../../bin/yt-dlp.exe');

        if (!fs.existsSync(ytDlpPath)) {
            return reject(new Error('yt-dlp binary not found in backend/bin'));
        }

        // Check for ffmpeg in system path or bin folder
        // We can try running ffmpeg -version
        exec('ffmpeg -version', (error) => {
            if (error) {
                // Try checking bin folder as fallback
                const ffmpegPath = path.join(__dirname, '../../bin/ffmpeg.exe');
                if (!fs.existsSync(ffmpegPath)) {
                    return reject(new Error('FFmpeg not found. Please install FFmpeg and add it to system PATH or backend/bin folder.'));
                }
            }
            resolve(true);
        });
    });
}

module.exports = {
    downloadTrack,
    checkPrerequisites,
    DOWNLOAD_DIR
};
