const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const taskRouter = require('./task.route');
const userRouter = require('./user.route');
const configRouter = require('./config.route');
const itemRouter = require('./item.route');
const partyRouter = require('./party.route');

const routes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/tasks',
    router: taskRouter,
  },
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/configs',
    router: configRouter,
  },
  {
    path: '/items',
    router: itemRouter,
  },
  {
    path: '/parties',
    router: partyRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
