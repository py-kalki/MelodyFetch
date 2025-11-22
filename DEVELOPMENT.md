# Development Guide for MelodyFetch

## Local Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git
- A Spotify Developer account
- A code editor (VS Code recommended)

### 1. Initial Setup

```bash
# Clone the repository
git clone <repo-url>
cd New

# Install dependencies for both frontend and backend
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Environment Configuration

#### Backend Setup
Create `backend/.env`:
```env
PORT=3001
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=debug
```

**Getting Spotify Credentials**:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Accept terms and create the app
4. Copy Client ID and Client Secret
5. Add Redirect URI: `http://localhost:3001/callback` (if needed)

#### Frontend Setup
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Running the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:3001`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`.

## Project Structure & Key Files

### Backend Structure

```
backend/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express app setup
│   ├── controllers/
│   │   ├── playlistController.js    # Playlist logic
│   │   └── downloadController.js    # Download logic
│   ├── routes/
│   │   └── api.js             # API route definitions
│   └── services/
│       ├── spotifyService.js  # Spotify API wrapper
│       ├── youtubeService.js  # YouTube search & download
│       ├── downloadService.js # Download orchestration
│       └── zipService.js      # ZIP creation
├── bin/
│   └── yt-dlp.exe             # YouTube downloader (Windows)
└── downloads/                 # Temporary file storage
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── PlaylistInput.jsx    # Playlist URL input
│   │   │   ├── TrackList.jsx        # Display track list
│   │   │   └── DownloadStatus.jsx   # Progress indicator
│   │   └── ui/
│   │       ├── Button.jsx           # Reusable button
│   │       ├── Card.jsx             # Card container
│   │       ├── Input.jsx            # Input field
│   │       └── ProgressBar.jsx      # Progress visualization
│   ├── pages/
│   │   ├── index.js           # Main page
│   │   ├── _app.js            # App wrapper
│   │   └── _document.js       # Document wrapper
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── utils/
│       └── api.js             # API client functions
└── public/                    # Static assets
```

## Development Workflow

### 1. Creating a New Feature

**Backend Example**: Adding a new endpoint

```javascript
// 1. Create service (services/exampleService.js)
export const getExample = async () => {
  // Implementation
};

// 2. Create controller (controllers/exampleController.js)
import { getExample } from '../services/exampleService.js';

export const exampleHandler = async (req, res) => {
  try {
    const result = await getExample();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Add route (routes/api.js)
import { exampleHandler } from '../controllers/exampleController.js';

router.get('/example', exampleHandler);
```

**Frontend Example**: Creating a new component

```javascript
// components/features/ExampleComponent.jsx
import { useState } from 'react';
import Button from '../ui/Button';

export default function ExampleComponent() {
  const [state, setState] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Example</h1>
      <Button onClick={() => setState('clicked')}>
        Click me
      </Button>
    </div>
  );
}
```

### 2. Making API Calls from Frontend

```javascript
// utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPlaylist = async (url) => {
  const response = await fetch(`${API_URL}/api/playlist?url=${url}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

// Usage in component
import { fetchPlaylist } from '../utils/api';

const handleFetch = async (url) => {
  try {
    const data = await fetchPlaylist(url);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### 3. Working with WebSocket

```javascript
// Frontend: Listening to progress
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL);

socket.on('progress', (data) => {
  console.log(`Progress: ${data.percentage}%`);
});

socket.on('complete', (data) => {
  console.log('Done!');
});

// Backend: Emitting progress
io.emit('progress', {
  percentage: 50,
  currentTrack: 'Song Name',
});
```

## Code Style & Best Practices

### Backend (Node.js/Express)

```javascript
// ✅ Good
const fetchTracks = async (playlistId) => {
  try {
    const response = await spotify.getPlaylistTracks(playlistId);
    return response.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
    }));
  } catch (error) {
    logger.error(`Failed to fetch tracks: ${error.message}`);
    throw new Error('Unable to fetch playlist');
  }
};

// ❌ Avoid
const fetchTracks = (playlistId) => {
  const response = spotify.getPlaylistTracks(playlistId);  // No await
  console.log('Fetching...');  // Use logger instead
  return response;
};
```

### Frontend (React/Next.js)

```javascript
// ✅ Good
export default function PlaylistInput({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      validateUrl(url);
      onSubmit(url);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

// ❌ Avoid
export default function PlaylistInput() {
  const [url, setUrl] = useState('');

  return (
    <div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={() => fetch(url)}>  {/* Don't put logic here */}
        Submit
      </button>
    </div>
  );
}
```

## Testing

### Backend Testing (Optional setup)

```bash
npm install --save-dev jest supertest
```

Example test:
```javascript
// __tests__/api.test.js
import request from 'supertest';
import app from '../src/app';

describe('API /api/playlist', () => {
  it('should return tracks for valid URL', async () => {
    const res = await request(app)
      .get('/api/playlist')
      .query({ url: 'valid_url' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### Frontend Testing (Jest + React Testing Library)

```javascript
// __tests__/PlaylistInput.test.js
import { render, screen } from '@testing-library/react';
import PlaylistInput from '../components/features/PlaylistInput';

describe('PlaylistInput', () => {
  it('renders input field', () => {
    render(<PlaylistInput onSubmit={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

## Debugging

### Backend Debugging

**Using VS Code Debugger**:
1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

2. Press F5 to start debugging

**Using Console Logs**:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

logger.info('User action', { userId: 123 });
logger.error('Error occurred', { error: 'details' });
```

### Frontend Debugging

- Use browser DevTools (F12)
- React DevTools extension for component inspection
- Network tab to monitor API calls
- Console for JavaScript errors

## Common Development Tasks

### Adding a new npm package

```bash
# Backend
cd backend && npm install package-name

# Frontend
cd frontend && npm install package-name
```

### Cleaning build artifacts

```bash
# Backend
rm -rf backend/node_modules package-lock.json && npm install

# Frontend
rm -rf frontend/.next frontend/node_modules && npm install
```

### Checking for security vulnerabilities

```bash
npm audit
npm audit fix  # Auto-fix if possible
```

### Linting and Formatting

```bash
# Frontend linting
cd frontend && npm run lint

# Format code (if prettier is available)
npx prettier --write .
```

## Troubleshooting

### Issue: "Cannot find module" error

**Solution**: Ensure all dependencies are installed
```bash
npm install
npm list  # Check installed packages
```

### Issue: EADDRINUSE (Port already in use)

**Solution**: Kill the process using the port
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Issue: Spotify authentication fails

**Solution**: Verify credentials
- Check `.env` file has correct ID and Secret
- Ensure no extra spaces or quotes
- Regenerate credentials if needed

### Issue: YouTube download fails

**Solution**: Update yt-dlp
```bash
# Windows
.\backend\bin\yt-dlp.exe -U

# Linux/Mac
yt-dlp -U
```

## Performance Tips

1. **Lazy load components** in frontend to reduce bundle size
2. **Cache Spotify responses** to reduce API calls
3. **Implement download queuing** to prevent overwhelming system
4. **Use async operations** properly to avoid blocking
5. **Monitor memory usage** during large conversions

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [Socket.io Documentation](https://socket.io/docs/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Tailwind CSS](https://tailwindcss.com/docs)
