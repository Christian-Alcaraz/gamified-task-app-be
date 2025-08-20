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

// router.patch('/:taskId/status', validate(taskValidation.patchUserTaskStatusById), taskController.patchUserTaskStatusById);

router
  .route('/:taskId')
  .get(validate(taskValidation.getUserTaskById), taskController.getUserTaskById)
  .put(validate(taskValidation.updateUserTaskById), taskController.updateUserTaskById);

module.exports = router;
