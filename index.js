#!/usr/bin/env node

/**
 * Start script for Prime Bot Website
 * Compatible with Vercel serverless deployment
 */

// Load environment variables
require('dotenv').config();

const path = require('path');

// For Vercel serverless, we need to export the Express app
const { app, startServer } = require('./js/server.js');

// Error handling for uncaught exceptions in serverless
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Wrap the app in error handling for Vercel
const handler = async (req, res) => {
  try {
    // Wait for app to handle the request
    await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    // Send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
      });
    }
  }
};

// Export the wrapped handler for Vercel
module.exports = handler;

// If running locally (not in Vercel), start the server
if (process.env.VERCEL !== '1' && require.main === module) {
  try {
    console.log('🚀 Starting Prime Bot Website locally...');
    startServer();
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}