const path = require('path');
const fs = require('fs');
const { DOWNLOAD_DIR } = require('../services/downloadService');

exports.downloadZip = (req, res) => {
    const { jobId, filename } = req.params;
    const filePath = path.join(DOWNLOAD_DIR, jobId, filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            } else {
                // Optional: Cleanup after download
                // fs.rmSync(path.join(DOWNLOAD_DIR, jobId), { recursive: true, force: true });
            }
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};
