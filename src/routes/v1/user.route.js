const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userController, userCharacterController } = require('../../controllers');
const { userValidation, userCharacterValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(userValidation.getUsers), userController.getUsers)
  .post(validate(userValidation.createUser), userController.createUser);

router.put('/update/:userId', validate(userValidation.updateUserById), userController.updateUserById);
router.patch('/status/:userId', validate(userValidation.patchUserStatusById), userController.patchUserStatusById);
router.get('/:userId', validate(userValidation.getUserById), userController.getUserById);

//** Character Routes **/

router.post(
  '/character/verify-name',
  validate(userCharacterValidation.isCharacterNameTaken),
  userCharacterController.isCharacterNameTaken,
);
router.patch(
  '/character/create',
  validate(userCharacterValidation.patchCreateUserCharacterById),
  userCharacterController.patchCreateUserCharacterById,
);

router.put(
  '/character',
  validate(userCharacterValidation.updateUserCharacterById),
  userCharacterController.updateUserCharacterById,
);

module.exports = router;
