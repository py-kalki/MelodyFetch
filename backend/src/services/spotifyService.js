const fetch = require('isomorphic-unfetch');
const { getTracks, getData } = require('spotify-url-info')(fetch);

async function getPlaylistTracks(playlistId) {
    const url = `https://open.spotify.com/playlist/${playlistId}`;
    
    try {
        // Fetch playlist data
        const playlistData = await getData(url);
        const playlistName = playlistData.name || playlistData.title || 'Unknown Playlist';

        // Fetch tracks
        const trackData = await getTracks(url);
        
        const tracks = trackData.map(track => {
            // Extract ID from URI (e.g. spotify:track:4LfCY65...)
            const id = track.uri ? track.uri.split(':').pop() : '';
            return {
                id: id,
                title: track.name || track.title || 'Unknown Title',
                artist: track.artist || track.subtitle || 'Unknown Artist',
                album: track.album || '', // Not provided by spotify-url-info for playlist tracks
                cover: playlistData.coverArt?.sources?.[0]?.url || '', // Fallback to playlist cover if possible
                duration: track.duration,
                releaseDate: ''
            };
        });

        return { name: playlistName, tracks };
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        throw error;
    }
}

module.exports = {
    getPlaylistTracks
};
