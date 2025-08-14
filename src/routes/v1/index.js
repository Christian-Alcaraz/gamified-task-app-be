const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const taskRouter = require('./task.route');
const userRouter = require('./user.route');

const routes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/task',
    router: taskRouter,
  },
  {
    path: '/user',
    router: userRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
