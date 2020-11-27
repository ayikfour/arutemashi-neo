const { liked } = require('../database');
const _ = require('lodash');

const update = (
   posts = [],
   tags = [],
   users = [],
   liked_count,
   before,
   after
) => {
   try {
      addPosts(posts);

      addTags(tags);
      flatten(getTags, setTags);

      addUsers(users);
      flatten(getUsers, setUsers);

      updateCursor(posts.length);
      setCount(liked_count);
      setBefore(before);
      setAfter(after);
   } catch (error) {
      console.log(error);
      process.exit(9);
   }
};

/**
 * Posts controller
 * get
 * add
 * set
 */
const getPosts = () => liked.get('posts').value();
const addPosts = (posts) =>
   liked
      .get('posts')
      .push(...posts)
      .write();
const setPosts = (posts) => liked.set('posts', posts).write();
const findPosts = (param) => liked.get('posts').find(param).value();

/**
 * Tags controller
 * get
 * add
 * set
 */
const getTags = () => liked.get('tags').value();
const addTags = (tags) => {
   liked
      .get('tags')
      .push(...tags)
      .write();
};
const setTags = (tags) => liked.set('tags', tags).write();

/**
 * Users controller
 * get
 * add
 * set
 */
const getUsers = () => liked.get('users').value();
const addUsers = (users) => {
   liked
      .get('users')
      .push(...users)
      .write();
};
const setUsers = (users) => liked.set('users', users).write();

/**
 * Before controllers
 * get
 * set
 */
const getBefore = () => liked.get('before').value();
const setBefore = (before) => liked.update('before', (b) => before).write();

/**
 * After controllers
 * get
 * set
 */
const getAfter = () => liked.get('after').value();
const setAfter = (after) => liked.update('after', (a) => after).write();

/**
 * Count controllers
 * get
 * set
 */
const getCount = () => liked.get('count').value();
const setCount = (count) => liked.update('count', (c) => count).write();

/**
 * Cursor controllers
 * get
 * set
 */
const getCursor = () => liked.get('cursor').value();
const setCursor = (cursor) => liked.update('cursor', (c) => cursor).write();
const updateCursor = (value) =>
   liked.update('cursor', (c) => c + value).write();

/**
 * @param {*} getter
 * function to get database value
 * @param {*} setter
 * function to set database value
 */
const flatten = (getter, setter) => {
   let current = getter();
   let uniq = _.uniqBy(current, 'id');
   setter(uniq);
};

module.exports = {
   update,
   getPosts,
   addPosts,
   setPosts,
   findPosts,
   getTags,
   addTags,
   setTags,
   getUsers,
   addUsers,
   setUsers,
   getBefore,
   setBefore,
   getAfter,
   setAfter,
   getCount,
   setCount,
   getCursor,
   setCursor,
   updateCursor,
   flatten,
};
