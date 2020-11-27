require('dotenv').config();
const minimist = require('minimist');
const error = require('./utils/error');
const arutemashi = require('./arutemashi/');
const db = require('./helper/database');

var args = minimist(process.argv.slice(2), {
   alias: {
      t: 'tumblr',
      u: 'user',
   },
   default: {
      count: 100,
   },
});

module.exports = () => {
   console.log(args);
   let cmd = args._[0] || 'help';

   if (args.version || args.v) {
      cmd = 'version';
   }

   if (args.tweet) {
      cmd = 'tweet';
   }

   if (args.tumblr || args.t) {
      cmd = 'tumblr';
   }

   switch (cmd) {
      case 'tumblr':
         arutemashi.tumblr.handle(args['tumblr'], args);
         break;
      case 'tweet':
         arutemashi.tweet.handle(args['tweet'], args);
         break;
      case 'wakeup':
         break;
      default:
         error(`"${cmd}" is not a valid command!`, true);
         break;
   }
};
