FROM node:18-alpine

# Install python3 and ffmpeg (required for yt-dlp to work and convert to mp3)
RUN apk add --no-cache python3 ffmpeg curl

WORKDIR /app

# Copy package files for backend
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Download the Linux version of yt-dlp and put it in the bin folder (or global)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

EXPOSE 10000

# Start the server
CMD ["npm", "start"]
