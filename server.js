require('dotenv').config();
const express = require('express');
const arutemashi = require('./src/arutemashi/cron');
const app = express();
const db_tweeted = require("./src/helper/databases/twit.js")

arutemashi.harvest.start();
arutemashi.post.start();

app.all('/', (req, res)=>{
    res.send('Your bot is alive!')
})

app.get('/tweeted', (req, res)=>{
    let tweeted = db_tweeted.getTweeted();
    res.send({tweeted})
})

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
