# MelodyFetch API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
Currently, the API does not require authentication. Spotify credentials are handled server-side using OAuth 2.0 Client Credentials flow.

## Endpoints

### 1. Fetch Playlist Tracks

**Endpoint**: `GET /api/playlist`

**Description**: Extracts tracks from a Spotify playlist URL.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Spotify playlist URL or ID |

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/playlist?url=https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYPtwS"
```

**Response** (200 OK):
```json
{
  "success": true,
  "playlist": {
    "id": "37i9dQZF1DXcBWIGoYPtwS",
    "name": "Today's Top Hits",
    "description": "The tracks that matter right now",
    "imageUrl": "https://...",
    "trackCount": 50
  },
  "tracks": [
    {
      "id": "11dFghVXANMlKmJXsNCQvb",
      "title": "Track Title",
      "artist": "Artist Name",
      "duration": 180,
      "imageUrl": "https://...",
      "previewUrl": "https://..."
    }
  ]
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid Spotify URL"
}
```

---

### 2. Start Conversion Process

**Endpoint**: `POST /api/convert`

**Description**: Initiates the download and ZIP conversion process for a playlist.

**Request Body**:
```json
{
  "playlistUrl": "https://open.spotify.com/playlist/...",
  "tracks": [
    {
      "id": "11dFghVXANMlKmJXsNCQvb",
      "title": "Track Title",
      "artist": "Artist Name"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Conversion started"
}
```

**WebSocket Events**:
During conversion, the backend emits real-time progress updates via WebSocket:

```javascript
// Progress update event
socket.on('progress', (data) => {
  {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "currentTrack": 5,
    "totalTracks": 50,
    "currentTrackTitle": "Song Name",
    "currentTrackArtist": "Artist Name",
    "percentage": 10,
    "status": "downloading"  // or "converting", "zipping"
  }
});

// Completion event
socket.on('complete', (data) => {
  {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "success": true,
    "zipFileName": "playlist_20231215_143022.zip",
    "totalSize": "1.2GB"
  }
});

// Error event
socket.on('error', (data) => {
  {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "error": "YouTube video not found",
    "failedTrack": "Track Title"
  }
});
```

---

### 3. Download ZIP File

**Endpoint**: `GET /api/download/:sessionId`

**Description**: Downloads the generated ZIP file.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Session ID from conversion response |

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/download/550e8400-e29b-41d4-a716-446655440000" \
  -o playlist.zip
```

**Response** (200 OK):
- File download initiated
- Content-Type: `application/zip`
- Header: `Content-Disposition: attachment; filename="playlist.zip"`

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Session not found or file has been deleted"
}
```

---

### 4. Get Session Status (Optional)

**Endpoint**: `GET /api/status/:sessionId`

**Description**: Retrieves the current status of a conversion session.

**Response** (200 OK):
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "in_progress",
  "progress": {
    "current": 15,
    "total": 50,
    "percentage": 30
  },
  "currentTrack": {
    "title": "Track Title",
    "artist": "Artist Name"
  }
}
```

---

## WebSocket Connection

**Connection URL**:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

**Emitted Events from Backend**:
- `progress` - Update on conversion progress
- `complete` - Conversion completed successfully
- `error` - Error occurred during processing

**Listening Example**:
```javascript
socket.on('progress', (data) => {
  console.log(`Progress: ${data.percentage}%`);
});

socket.on('complete', (data) => {
  console.log('Conversion finished!');
  window.location.href = `/api/download/${data.sessionId}`;
});

socket.on('error', (data) => {
  console.error('Error:', data.error);
});
```

---

## Error Handling

### Common Error Codes

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| 400 | Invalid Spotify URL | Malformed playlist URL | Verify URL format |
| 401 | Spotify auth failed | Invalid credentials | Check `.env` file |
| 404 | Session not found | Session expired | Start new conversion |
| 429 | Rate limit exceeded | Too many requests | Wait and retry |
| 500 | Server error | Internal error | Check server logs |

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional context (optional)"
}
```

---

## Rate Limiting

- **Per IP**: 60 requests per minute
- **Per session**: 1 active conversion at a time
- Headers returned:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Pagination

Currently not implemented. Playlist endpoints return all tracks.

---

## Timeouts

- **Playlist fetch**: 10 seconds
- **YouTube search**: 5 seconds per track
- **Download**: 30 seconds per track
- **Zipping**: 5 minutes total

---

## File Size Limits

- **Max playlist size**: 500 tracks
- **Max ZIP file**: 5 GB
- **Max individual MP3**: 500 MB

---

## Testing with cURL

### Fetch tracks
```bash
curl -X GET "http://localhost:3001/api/playlist?url=https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYPtwS"
```

### Start conversion
```bash
curl -X POST "http://localhost:3001/api/convert" \
  -H "Content-Type: application/json" \
  -d '{
    "playlistUrl": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYPtwS",
    "tracks": [...]
  }'
```

### Download ZIP
```bash
curl -X GET "http://localhost:3001/api/download/550e8400-e29b-41d4-a716-446655440000" \
  --output playlist.zip
```

---

## API Versioning

Current version: **v1** (implied in current endpoints)

Future versions may be prefixed: `/api/v2/...`

---

## Changelog

### v1.0.0 (Current)
- Playlist fetching from Spotify
- YouTube audio download and conversion
- ZIP creation and download
- Real-time progress via WebSocket
- Basic error handling

---

## Future Enhancements

- [ ] User authentication & authorization
- [ ] Batch playlist conversion
- [ ] Download history API
- [ ] Audio quality selection
- [ ] API rate limit per user
- [ ] Webhooks for completion notifications
- [ ] GraphQL endpoint
