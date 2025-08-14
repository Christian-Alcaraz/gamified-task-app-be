const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(userValidation.getUsers), userController.getUsers)
  .post(validate(userValidation.createUser), userController.createUser);

router.put('/update/:userId', validate(userValidation.updateUserById), userController.updateUserById);
router.patch('/status/:userId', validate(userValidation.patchUserStatusById), userController.patchUserStatusById);
router.get('/:userId', validate(userValidation.getUserById), userController.getUserById);

module.exports = router;
