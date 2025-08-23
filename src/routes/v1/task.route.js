const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { taskController } = require('../../controllers');
const { taskValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(taskValidation.getTasks), taskController.getTasks)
  .post(validate(taskValidation.createTask), taskController.createTask);

// router.patch('/:taskId/status', validate(taskValidation.patchTaskStatusById), taskController.patchTaskStatusById);

router
  .route('/:taskId')
  .get(validate(taskValidation.getTaskById), taskController.getTaskById)
  .put(validate(taskValidation.updateTaskById), taskController.updateTaskById);

module.exports = router;
