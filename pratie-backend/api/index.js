const { createApp } = require('../dist/app.js');

// Initialize the Express app instance for Vercel Serverless Function runtime
const app = createApp();

module.exports = app;
