const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.registerUser);
router.post('/login', validate(authValidation.login), authController.loginUserWithEmailAndPassword);

router.use(authorize());

module.exports = router;
