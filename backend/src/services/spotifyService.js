const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let tokenExpirationTime = 0;

async function ensureAccessToken() {
    const now = Date.now();
    if (now >= tokenExpirationTime) {
        try {
            const data = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(data.body['access_token']);
            // Set expiration time (subtract 60s buffer)
            tokenExpirationTime = now + (data.body['expires_in'] * 1000) - 60000;
            console.log('Spotify access token refreshed');
        } catch (error) {
            console.error('Error refreshing Spotify token:', error);
            throw new Error('Failed to authenticate with Spotify');
        }
    }
}

async function getPlaylistTracks(playlistId) {
    await ensureAccessToken();

    let tracks = [];
    let offset = 0;
    let limit = 100;
    let keepFetching = true;

    try {
        // First fetch to get playlist details (name, etc)
        const playlistData = await spotifyApi.getPlaylist(playlistId, { fields: 'name' });
        const playlistName = playlistData.body.name;

        while (keepFetching) {
            const response = await spotifyApi.getPlaylistTracks(playlistId, { offset, limit });
            const items = response.body.items;

            items.forEach(item => {
                if (item.track) {
                    tracks.push({
                        id: item.track.id,
                        title: item.track.name,
                        artist: item.track.artists.map(a => a.name).join(', '),
                        album: item.track.album.name,
                        cover: item.track.album.images[0]?.url,
                        duration: item.track.duration_ms,
                        releaseDate: item.track.album.release_date
                    });
                }
            });

            if (items.length < limit) keepFetching = false;
            offset += limit;
        }

        return { name: playlistName, tracks };
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        throw error;
    }
}

module.exports = {
    getPlaylistTracks
};
