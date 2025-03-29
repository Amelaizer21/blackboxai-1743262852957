const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const config = require('../config/image-processing');
const { promisify } = require('util');
const imageProcessingLimiter = require('../middleware/rate-limiter');

const mkdirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);

// Apply rate limiting
router.use(imageProcessingLimiter);

// Secure filename validation
const isValidFilename = (filename) => {
  return /^[a-z0-9\-._]+$/i.test(filename) && 
         !filename.includes('..') &&
         (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'));
};

// Ensure directories exist
async function ensureDirectories() {
  for (const dir of [config.uploadDir, config.processedDir]) {
    try {
      await statAsync(dir);
    } catch {
      await mkdirAsync(dir, { recursive: true });
    }
  }
}

router.get('/process-image/:filename', async (req, res, next) => {
  try {
    await ensureDirectories();
    
    const { filename } = req.params;
    const { width = 800, format = 'webp' } = req.query;

    // Validate inputs
    if (!isValidFilename(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    if (!config.formats.includes(format)) {
      return res.status(400).json({ error: 'Unsupported format' });
    }

    if (isNaN(width) || width < 100 || width > 2000) {
      return res.status(400).json({ error: 'Invalid width' });
    }

    const inputPath = path.join(config.uploadDir, filename);
    const outputFilename = `${path.parse(filename).name}-${width}.${format}`;
    const outputPath = path.join(config.processedDir, outputFilename);

    await sharp(inputPath)
      .resize(Number(width))
      .toFormat(format, {
        quality: config.quality,
        progressive: true
      })
      .toFile(outputPath);

    res.sendFile(outputPath, { 
      root: process.cwd(),
      maxAge: config.cacheTTL * 1000,
      headers: {
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;