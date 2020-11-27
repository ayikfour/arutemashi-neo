// const arutemashi = require('../src/arutemashi/index');
require('dotenv').config();
const { twitter_token } = require('../config');
// sentiment.get(
//    'https://twitter.com/angewwie/status/1328258284420169728?s=20',
//    'negative'
// );
// arutemashi.tumblr.liked();
console.log(process.env);
console.log(twitter_token);
