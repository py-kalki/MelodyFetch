const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

function createZip(jobId, playlistName, files) {
    return new Promise((resolve, reject) => {
        const jobDir = path.join(__dirname, '../../downloads', jobId);

        // Sanitize playlist name for filename
        let sanitizedName = playlistName
            ? playlistName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_').substring(0, 50)
            : jobId;

        // Fallback to jobId if sanitization results in empty string
        if (!sanitizedName || sanitizedName.trim() === '') {
            sanitizedName = jobId;
        }

        const zipPath = path.join(jobDir, `melodyfetch_${sanitizedName}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(zipPath);
        });

        archive.on('error', function (err) {
            reject(err);
        });

        archive.pipe(output);

        files.forEach(file => {
            if (file.success && file.path && fs.existsSync(file.path)) {
                archive.file(file.path, { name: path.basename(file.path) });
            }
        });

        archive.finalize();
    });
}

module.exports = {
    createZip
};
