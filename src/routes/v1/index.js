const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');

const routes = [
  {
    path: '/auth',
    router: authRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
