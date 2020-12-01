const Twit = require('twit');
const { twitter_token } = require('../../config');
const util = require('util');
const path = require('path');
const db_liked = require('../helper/databases/liked');
const db_dashboard = require('../helper/databases/dashboard');
const db_user = require('../helper/databases/user');
const db_twit = require('../helper/databases/twit');
const ora = require('ora');
const _ = require('lodash');
const IO = require('../utils/IO');

const T = new Twit(twitter_token);

const draft = async () => {
   const spinner = ora('moving new post to draft');
   try {
      spinner.text = 'get posts from liked';
      const newPostsFromLiked = db_liked.getPosts();
      spinner.text = 'get posts from dashboard';
      const newPostsFromDashboard = db_dashboard.getPosts();
      spinner.text = 'join posts from liked and dashboard';

      let newPosts = _.unionBy(newPostsFromDashboard, newPostsFromLiked, 'id');

      spinner.text = 'get uniq post';
      const oldPosts = db_twit.getTweeted();
      let newDraft = _.uniqWith(newPosts, oldPosts, 'id');

      // console.log(newDraft);
      db_twit.update(newDraft);
      spinner.succeed('draft has been updated! ✨');
   } catch (error) {
      spinner.fail(error.message);
      console.log(error);
   }
};

const clean = async () => {
   const spinner = ora('cleaning twit database...');
   try {
      spinner.text = 'cleaning draft tweet from garbage...';
      const draftPosts = db_twit.getDraft();
      const cleanedDraft = draftPosts.filter((post) => post !== null);
      db_twit.setDraft(cleanedDraft);
      spinner.succeed();
   } catch (error) {
      spinner.fail(error.message);
   }
};

const post = async () => {
   const spinner = ora('moving new post to draft');
   try {
      spinner.start('get first post on draft...');
      const draftPosts = db_twit.getDraft();
      spinner.succeed();

      if (draftPosts.length == 0) {
         await draft();
         throw Error('Draft is empty, moving new draft');
      }

      const postItem = _.sample(draftPosts);
      if (!postItem) {
         await clean();
         throw Error('There is a garbage in draft.');
      }

      // console.log(postItem);
      spinner.start(`downloading image from ${postItem.photo}`);
      const filepath = await IO.download(postItem.photo, postItem.id);
      spinner.succeed();

      spinner.start('load the downloaded image...');
      const media = await IO.readImage(filepath);
      spinner.succeed();

      spinner.start('uploading media to twitter...');
      const media_id_string = await upload(media);
      spinner.succeed();

      spinner.start('tweeting media...');
      const tweeted = await T.post('statuses/update', {
         media_ids: [media_id_string],
      });
      spinner.succeed();

      spinner.start('cleaning draft...');
      db_twit.addTweeted([{ ...postItem, sourced: false }]);
      db_twit.removeDraft({ id: postItem.id });

      spinner.text = 'deleting image...';
      IO.remove(filepath);
      spinner.succeed('Done! 🦄');
   } catch (error) {
      spinner.fail(error.message);
   }
};

const upload = async (media = '') => {
   try {
      const {
         data: { media_id_string },
      } = await T.post('media/upload', { media_data: media });

      return media_id_string;
   } catch (error) {
      console.log(error);
   }
};

const handle = async (action, args) => {
   const used = process.memoryUsage().heapUsed / 1024 / 1024;
   switch (action) {
      case 'draft':
         await draft();
         console.log(`The script uses approximately ${used} MB`);
         break;
      case 'post':
         await post();
         console.log(`The script uses approximately ${used} MB`);
         break;
      default:
         console.log('not found command for tumblr');
         break;
   }
};

module.exports = { draft, post, upload, handle };
