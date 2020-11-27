const { twit } = require('../database');
const _ = require('lodash');

const update = (posts = []) => {
   try {
      addDraft(posts);
   } catch (error) {
      console.log(error);
      process.exit(9);
   }
};

/**
 * Draft controller
 * get
 * add
 * set
 */
const getDraft = () => twit.get('draft').value();
const addDraft = (draft) =>
   twit
      .get('draft')
      .push(...draft)
      .write();
const setDraft = (draft) => twit.set('draft', draft).write();
const removeDraft = (param) => twit.get('draft').remove(param).write();

/**
 * Tweeted controller
 * get
 * add
 * set
 */
const getTweeted = () => twit.get('tweeted').value();
const addTweeted = (tweeted) => {
   twit
      .get('tweeted')
      .push(...tweeted)
      .write();
};
const setTweeted = (tweeted) => twit.set('tweeted', tweeted).write();

/**
 * Users controller
 * get
 * add
 * set
 */
const getUsers = () => twit.get('users').value();
const addUsers = (users) => {
   twit
      .get('users')
      .push(...users)
      .write();
};
const setUsers = (users) => twit.set('users', users).write();

/**
 * Count controllers
 * get
 * set
 */
const getCount = () => twit.get('count').value();
const setCount = (count) => twit.update('count', (c) => count).write();

/**
 * Cursor controllers
 * get
 * set
 */
const getCursor = () => twit.get('cursor').value();
const setCursor = (cursor) => twit.update('cursor', (c) => cursor).write();
const updateCursor = (value) => twit.update('cursor', (c) => c + value).write();

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
   master: twit,
   update,
   getDraft,
   addDraft,
   removeDraft,
   getTweeted,
   addTweeted,
   setTweeted,
   getCount,
   setCount,
   getCursor,
   setCursor,
   updateCursor,
   flatten,
};
