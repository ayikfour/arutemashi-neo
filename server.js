require('dotenv').config();
const express = require('express');
const arutemashi = require('./src/arutemashi/cron');
const app = express();

arutemashi.harvest.start();
arutemashi.post.start();

const server = app.listen(process.env.port, () => {
   console.log(`Arutemashi is running on port ${process.env.port} 🔥`);
});

process.on('exit', async function () {
   server.close();
   arutemashi.harvest.stop();
   arutemashi.post.stop();
   process.exit();
});

process.on('SIGINT', async function () {
   server.close();
   arutemashi.harvest.stop();
   arutemashi.post.stop();
   process.exit();
});

process.on('SIGTERM', async function () {
   server.close();
   arutemashi.harvest.stop();
   arutemashi.post.stop();
   process.exit();
});
