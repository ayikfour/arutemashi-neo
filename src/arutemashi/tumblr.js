const tumblr = require('tumblr.js');
const { tumblr_token } = require('../../config');
const util = require('util');
const path = require('path');
const IO = require('../utils/IO');
const db_liked = require('../helper/databases/liked');
const db_dashboard = require('../helper/databases/dashboard');
const db_user = require('../helper/databases/user');
const ora = require('ora');
const _ = require('lodash');

var client = tumblr.createClient(tumblr_token);

var likes = util.promisify(client.userLikes);
var dashboard = util.promisify(client.userDashboard);

const liked = async () => {
   const TAG = 'liked';

   const spinner = ora('fetch liked posts from Tumblr');
   try {
      let before = db_liked.getBefore();

      spinner.start();
      let { liked_posts, liked_count, _links } = await likes({
         before: before,
      });
      spinner.succeed();

      before = _links.next.query_params.before;
      let after = _links.prev.query_params.after;

      if (!liked_posts) throw Error;

      let tags = [];
      let users = [];

      spinner.start('cleaning post and deconstruct...');
      liked_posts = liked_posts.filter(
         (post) =>
            post === 'photo' && !db_liked.findPosts({ id: post.id_string })
      );

      let posts = liked_posts.map((post, index) => {
         let data = {
            id: post.id_string,
            name: post.blog_name,
            date: post.date,
            url: post.post_url,
            photo: post.photos[0].original_size.url,
            tags: post.tags,
         };
         if (post.tags.length != 0) {
            tags.push(...post.tags);
         }
         users.push(post.blog_name);
         return data;
      });
      spinner.succeed();

      spinner.start('saving posts to the db...');
      db_liked.update(posts, tags, users, liked_count, before, after);
      spinner.succeed(
         `posts has been saved! count:${liked_count} current:${db_liked.getCursor()}`
      );
      return posts;
   } catch (error) {
      spinner.fail('failed! :(');
      console.log(error);
   }
};

const home = async () => {
   const TAG = 'dashboard';

   const spinner = ora('fetch dashboard posts from Tumblr');
   try {
      let offset = db_dashboard.getOffset();

      spinner.start();
      let { posts } = await dashboard({
         offset: offset,
         type: 'photo',
      });
      spinner.succeed();

      if (!posts) throw Error;

      let tags = [];
      let users = [];

      spinner.start('cleaning post and deconstruct...');
      let new_posts = posts.map((post, index) => {
         let data = {
            id: post.id_string,
            name: post.blog_name,
            date: post.date,
            url: post.post_url,
            photo: post.photos[0].original_size.url,
            tags: post.tags,
         };
         if (post.tags.length != 0) {
            tags.push(...post.tags);
         }
         users.push(post.blog_name);
         return data;
      });
      spinner.succeed();

      // Saving new post, tags, users, offset, since to the db
      spinner.start('saving posts to the db...');
      offset = _.last(posts).id_string;
      let since = _.head(posts).id_string;

      db_dashboard.update(new_posts, tags, users, offset, since);

      // Success saving to the db
      spinner.succeed(
         `posts has been saved! current count:${db_dashboard.getCount()}`
      );
      return new_posts;
   } catch (error) {
      spinner.fail('failed! :(');
      console.log(error);
   }
};

const add_user = async (name = '', tags = '') => {
   const TAG = 'user';
   const spinner = ora('add new user to the database');
   try {
      if (name === '') return;
      tags = tags.split(',');
      name = name.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
      name = name.replace(/\//i, '');
      let user = [{ name: name, tags: tags }];

      spinner.start();
      db_user.update(user, tags);
      spinner.succeed(`${name} has been saved with tags:${tags}`);
   } catch (error) {
      spinner.fail('failed :(');
   }
};

const reset = async (option = 'dashboard') => {
   const spinner = ora('reset tumblr database...');
   try {
      switch (option) {
         case 'dashboard':
            spinner.text = 'reset dashboard cursor...';
            db_dashboard.setOffset(0);
            db_dashboard.setSince(0);
            break;
         case 'liked':
            spinner.text = 'reset liked cursor...';
            db_liked.setBefore(0);
            db_liked.setAfter(0);
            break;
         case 'all':
            spinner.text = 'reset dashboard cursor...';
            db_dashboard.setOffset(0);
            db_dashboard.setSince(0);
            spinner.text = 'reset liked cursor...';
            db_liked.setBefore(0);
            db_liked.setAfter(0);
            break;
         default:
            break;
      }
      spinner.succeed();
   } catch (error) {
      spinner.fail(error.message);
   }
};

const handle = async (action, args) => {
   const used = process.memoryUsage().heapUsed / 1024 / 1024;
   switch (action) {
      case 'add':
         let user = args['user'];
         let tags = args['tags'];
         add_user(user, tags);
         console.log(`The script uses approximately ${used} MB`);
         break;
      case 'liked':
         liked();
         console.log(`The script uses approximately ${used} MB`);
         break;
      case 'home':
         await home();
         console.log(`The script uses approximately ${used} MB`);
         break;
      case 'reset':
         let option = args['option'];
         await reset(option);
         console.log(`The script uses approximately ${used} MB`);
         break;
      default:
         console.log('not found command for tumblr');
         break;
   }
};

module.exports = { liked, home, add_user, reset, handle };
