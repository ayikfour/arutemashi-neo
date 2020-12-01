const cron = require('node-cron');
const tumblr = require('./tumblr');
const tweet = require('./tweet');
const ora = require('ora');

const harvest = cron.schedule('*/15 * * * *', async () => {
   await tumblr.home();
   await tumblr.liked();
});

const post = cron.schedule('*/10 * * * *', async () => {
   await tweet.post();
});

module.exports = { harvest, post };
