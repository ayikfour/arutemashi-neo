const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter_liked = new FileSync('./src/helper/databases/liked_db.json');
const liked = low(adapter_liked);

const adapter_dashboard = new FileSync(
   './src/helper/databases/dashboard_db.json'
);
const dashboard = low(adapter_dashboard);

const adapter_user = new FileSync('./src/helper/databases/user_db.json');
const user = low(adapter_user);

const adapter_twit = new FileSync('./src/helper/databases/twit_db.json');
const twit = low(adapter_twit);

liked
   .defaults({
      posts: [],
      tags: [],
      users: [],
      count: 0,
      cursor: 0,
      before: '',
      after: '',
   })
   .write();

dashboard
   .defaults({
      posts: [],
      tags: [],
      users: [],
      since: 0,
      offset: 0,
      count: 0,
   })
   .write();

user
   .defaults({
      users: [],
      tags: [],
      count: 0,
   })
   .write();

twit
   .defaults({
      draft: [],
      tweeted: [],
      cursor: 0,
      count: 0,
   })
   .write();

module.exports = { dashboard, liked, user, twit };
