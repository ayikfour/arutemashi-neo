const cron = require('node-cron');
const tumblr = require('./tumblr');
const tweet = require('./tweet');
const ora = require('ora');

const harvest = cron.schedule('*/30 * * * *', async () => {
   await tumblr.home();
   await tumblr.liked();
});

const post = cron.schedule('*/4 * * * *', async () => {
   await tweet.post();
});

module.exports = { harvest, post };
