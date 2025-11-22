const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const downloadController = require('../controllers/downloadController');

router.post('/playlist/parse', playlistController.parsePlaylist);
router.post('/playlist/process', playlistController.processPlaylist);
router.get('/download/:jobId/:filename', downloadController.downloadZip);

module.exports = router;
