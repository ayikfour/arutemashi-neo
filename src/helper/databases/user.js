const { user } = require('../database');
const _ = require('lodash');
const { isArray } = require('lodash');

const update = (users = [], tags = []) => {
   try {
      addUsers(users);
      flatten(getUsers, setUsers);

      addTags(tags);
      flatten(getTags, setTags);

      setCount(users.length);
   } catch (error) {
      console.log(error);
      process.exit(9);
   }
};

/**
 * Users controller
 * get
 * add
 * set
 */
const getUsers = () => user.get('users').value();
const addUsers = (users) => {
   user
      .get('users')
      .push(...users)
      .write();
};
const setUsers = (users) => user.set('users', users).write();

/**
 * Tags controller
 * get
 * add
 * set
 */
const getTags = () => user.get('tags').value();
const addTags = (tags) => {
   user
      .get('tags')
      .push(...tags)
      .write();
};
const setTags = (tags) => user.set('tags', tags).write();

/**
 * Count controllers
 * get
 * set
 */
const getCount = () => user.get('count').value();
const setCount = (count) => user.update('count', (c) => count).write();

/**
 * @param {*} getter
 * function to get database value
 * @param {*} setter
 * function to set database value
 */
const flatten = (getter, setter) => {
   let current = getter();
   let uniq = _.uniq(current);
   setter(uniq);
};

module.exports = {
   update,
   getUsers,
   addUsers,
   setUsers,
   getTags,
   addTags,
   setTags,
   getCount,
   setCount,
   flatten,
};
