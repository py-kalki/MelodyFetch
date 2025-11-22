# MelodyFetch Architecture

## Project Overview
MelodyFetch is a full-stack web application that converts Spotify playlists into downloadable ZIP files containing MP3s downloaded from YouTube.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                     │
│  - React Components (Playlist Input, Track List, Download)     │
│  - WebSocket Client (Real-time Progress Updates)               │
│  - Tailwind CSS Styling & Framer Motion Animations             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API Routes (api.js)                                            │
│  ├── GET  /api/playlist - Fetch playlist tracks                │
│  ├── POST /api/convert - Start conversion process              │
│  └── GET  /api/download/:id - Download ZIP file                │
│                                                                 │
│  Controllers                                                    │
│  ├── playlistController.js - Playlist fetching logic           │
│  └── downloadController.js - Download management               │
│                                                                 │
│  Services                                                       │
│  ├── spotifyService.js - Spotify API integration               │
│  ├── youtubeService.js - YouTube search & match                │
│  ├── downloadService.js - File download orchestration          │
│  └── zipService.js - ZIP creation                              │
│                                                                 │
│  External Integrations                                          │
│  ├── Spotify Web API - Track metadata                          │
│  ├── YouTube Search - Finding best audio matches               │
│  └── yt-dlp - Audio download & MP3 conversion                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │   File System (downloads/)        │
        │   - Downloaded MP3 files          │
        │   - ZIP archives                  │
        └──────────────────────────────────┘
```

## Directory Structure

### Backend (`backend/`)
```
backend/
├── bin/
│   └── yt-dlp.exe          # YouTube downloader binary
├── downloads/              # Temporary download storage
├── src/
│   ├── app.js             # Express app configuration
│   ├── server.js          # Server entry point
│   ├── controllers/        # Request handlers
│   ├── routes/            # API route definitions
│   └── services/          # Business logic
├── package.json           # Dependencies
└── .env                   # Environment variables (git-ignored)
```

### Frontend (`frontend/`)
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/
│   │   ├── features/      # Feature components
│   │   └── ui/            # Reusable UI components
│   ├── pages/             # Next.js pages & API routes
│   ├── styles/            # Global styles
│   └── utils/             # Helper functions
├── package.json           # Dependencies
└── next.config.mjs        # Next.js configuration
```

## Data Flow

### 1. Playlist Fetching
```
User Input (Playlist URL)
    ↓
Frontend: PlaylistInput Component
    ↓
HTTP: GET /api/playlist?url=...
    ↓
Backend: playlistController.js
    ↓
Service: spotifyService.js (Spotify API)
    ↓
Response: Track metadata (title, artist, duration)
    ↓
Frontend: TrackList displays results
```

### 2. Conversion Process
```
User: Clicks "Start Conversion"
    ↓
Backend: Orchestrates conversion via downloadService.js
    ↓
For each track:
  ├─ youtubeService: Search YouTube
  ├─ youtubeService: Download audio (yt-dlp)
  └─ Convert to MP3
    ↓
WebSocket: Send progress updates to Frontend
    ↓
Frontend: ProgressBar updates in real-time
    ↓
Backend: zipService creates ZIP archive
    ↓
Response: ZIP file ready for download
```

### 3. Download
```
User: Clicks "Download ZIP"
    ↓
Frontend: GET /api/download/:sessionId
    ↓
Backend: Serves ZIP file
    ↓
Browser: Downloads file
    ↓
Cleanup: Temporary files deleted
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Archive**: Archiver
- **External APIs**: Spotify Web API, YouTube
- **CLI Tool**: yt-dlp

## Key Design Patterns

### 1. Service Layer Architecture
Business logic is separated into service modules (`spotifyService`, `youtubeService`, etc.), enabling reusability and testability.

### 2. Controller Pattern
Controllers handle HTTP requests and delegate to services, keeping concerns separated.

### 3. Async Operations with WebSocket
Long-running operations (downloads, zipping) emit progress events via WebSocket for real-time UI updates.

### 4. Error Handling
Centralized error handling with logging for debugging and monitoring.

## Security Considerations

1. **Environment Variables**: Sensitive credentials (Spotify API keys) stored in `.env`
2. **CORS**: Configured to accept requests only from frontend URL
3. **Input Validation**: Playlist URLs and search queries validated before processing
4. **File Cleanup**: Temporary downloads automatically cleaned after processing
5. **Helmet**: HTTP headers hardened against common vulnerabilities

## Performance Optimizations

1. **Parallel Processing**: Multiple tracks downloaded simultaneously (configurable concurrency)
2. **Caching**: Consider caching frequently accessed Spotify metadata
3. **File Streaming**: Large ZIP files streamed rather than loaded in memory
4. **WebSocket**: Reduces overhead vs. polling for progress updates

## Deployment Considerations

- Environment variables must be set on production server
- File storage path must be writable and have sufficient disk space
- Consider implementing cleanup cron job for old downloads
- Use process manager (PM2) for production stability
- Implement rate limiting for API endpoints
- Add request logging for monitoring

## Future Enhancements

- [ ] Playlist caching mechanism
- [ ] User authentication & download history
- [ ] Audio quality settings
- [ ] Batch playlist conversion
- [ ] User preferences storage
- [ ] Analytics & monitoring
- [ ] Docker containerization
