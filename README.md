# MelodyFetch

**Move your music anywhere. No limits.**

MelodyFetch is a web application that allows users to convert Spotify playlists into downloadable ZIP files containing MP3s, matched and downloaded from YouTube.

## 🚀 Features
- **Spotify Integration**: Extracts track metadata from public playlists.
- **Smart Matching**: Finds the best audio match on YouTube.
- **High-Quality Audio**: Downloads and converts to MP3 using `yt-dlp`.
- **Real-time Progress**: WebSocket-powered progress bar for downloads and zipping.
- **Modern UI**: Built with Next.js and Tailwind CSS for a premium experience.

## 📋 Prerequisites
- **Node.js** (v18 or higher)
- **Spotify Developer Account** (for Client ID & Secret)
- **yt-dlp** (Binary is included in `backend/bin` for Windows, but ensure you have necessary runtimes)

## 🛠️ Installation & Setup

### 1. Backend Setup
The backend handles API requests, YouTube searching, and file processing.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with your credentials:
    ```env
    PORT=3001
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    FRONTEND_URL=http://localhost:3000
    ```
    *To get Spotify credentials, go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).*

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:3001`.

### 2. Frontend Setup
The frontend provides the user interface.

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## 📖 Usage Guide
1.  Open `http://localhost:3000` in your browser.
2.  Paste a **Public Spotify Playlist URL** (e.g., `https://open.spotify.com/playlist/...`).
3.  Click **Fetch Tracks** to preview the song list.
4.  Click **Start Conversion** to begin the download process.
5.  Wait for the progress bar to reach 100%.
6.  Click **Download ZIP** to save your music.

## 🔧 Troubleshooting
- **Download Errors**: Ensure `backend/bin/yt-dlp.exe` exists. If you are on Linux/Mac, you may need to install `yt-dlp` globally or download the appropriate binary to `backend/bin`.
- **Spotify Auth Errors**: Double-check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `backend/.env`.
- **Connection Refused**: Ensure the backend is running on port 3001 and the frontend can reach it.

## 🏗️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Framer Motion, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, Archiver
- **Core Tools**: yt-dlp, Spotify Web API
