const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.get('/test-error', (req, res, next) => {
  next(new ApiError(httpStatus.BAD_REQUEST, 'Test error'));
});

router.post('/register', validate(authValidation.register), authController.registerUser);
router.post('/login', validate(authValidation.login), authController.loginUserWithEmailAndPassword);

router.use(authorize());
router.get('/me', authController.me);

module.exports = router;
