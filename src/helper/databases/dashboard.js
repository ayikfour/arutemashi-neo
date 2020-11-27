const { dashboard } = require('../database');
const _ = require('lodash');

const update = (posts = [], tags = [], users = [], offset, since) => {
   try {
      addPosts(posts);
      console.log(getPosts().length);

      flatten(getPosts, setPosts);
      console.log(getPosts().length);

      addTags(tags);
      flatten(getTags, setTags);

      addUsers(users);
      flatten(getUsers, setUsers);

      setSince(since);
      setOffset(offset);
      setCount(getPosts().length);
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
const getPosts = () => dashboard.get('posts').value();
const addPosts = (posts) =>
   dashboard
      .get('posts')
      .push(...posts)
      .write();
const setPosts = (posts) => dashboard.set('posts', posts).write();
const findPosts = (param) => dashboard.get('posts').find(param).value();

/**
 * Tags controller
 * get
 * add
 * set
 */
const getTags = () => dashboard.get('tags').value();
const addTags = (tags) => {
   dashboard
      .get('tags')
      .push(...tags)
      .write();
};
const setTags = (tags) => dashboard.set('tags', tags).write();

/**
 * Users controller
 * get
 * add
 * set
 */
const getUsers = () => dashboard.get('users').value();
const addUsers = (users) => {
   dashboard
      .get('users')
      .push(...users)
      .write();
};
const setUsers = (users) => dashboard.set('users', users).write();

/**
 * Since controller
 * get
 * set
 */
const getSince = () => dashboard.get('since').value();
const setSince = (since) => dashboard.update('since', (s) => since).write();

/**
 * Count controllers
 * get
 * set
 */
const getCount = () => dashboard.get('count').value();
const setCount = (count) => dashboard.update('count', (c) => count).write();

/**
 * Offset controllers
 * get
 * set
 */
const getOffset = () => dashboard.get('offset').value();
const setOffset = (offset) => dashboard.update('offset', (o) => offset).write();

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
   findPosts,
   getTags,
   addTags,
   setTags,
   getUsers,
   addUsers,
   setUsers,
   getSince,
   setSince,
   getCount,
   setCount,
   getOffset,
   setOffset,
   flatten,
};
