const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { taskController } = require('../../controllers');
const { taskValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(taskValidation.getUserTasks), taskController.getUserTasks)
  .post(validate(taskValidation.createUserTask), taskController.createUserTask);

router.put('/update/:taskId', validate(taskValidation.updateUserTaskById), taskController.updateUserTaskById);
router.patch('/status/:taskId', validate(taskValidation.patchUserTaskStatusById), taskController.patchUserTaskStatusById);
router.get('/:taskId', validate(taskValidation.getUserTaskById), taskController.getUserTaskById);

module.exports = router;
