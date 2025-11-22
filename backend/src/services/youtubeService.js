// This service is mainly a placeholder if we were using YouTube Data API.
// Since we are using yt-dlp for search and download, the search logic is embedded in downloadService.
// However, we can use this for explicit search if needed later.

// For now, we will keep it simple and let downloadService handle the search-and-download via yt-dlp.
// But to follow the plan, I'll add a helper here if we want to pre-validate matches.

const { exec } = require('child_process');

function searchVideo(query) {
    return new Promise((resolve, reject) => {
        // Use yt-dlp to get JSON info for the first result
        const command = `yt-dlp "ytsearch1:${query}" --dump-json --no-playlist --flat-playlist`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                // reject(error); // Don't reject, just return null
                console.warn(`Search failed for ${query}:`, error.message);
                resolve(null);
                return;
            }
            try {
                const info = JSON.parse(stdout);
                resolve({
                    id: info.id,
                    title: info.title,
                    url: info.webpage_url || info.url,
                    duration: info.duration
                });
            } catch (e) {
                resolve(null);
            }
        });
    });
}

module.exports = {
    searchVideo
};
