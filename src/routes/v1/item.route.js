const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { itemController } = require('../../controllers');
const { itemValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(itemValidation.getItems), itemController.getItems)
  .post(validate(itemValidation.createItem), itemController.createItem);

// router.patch('/status', validate(itemValidation.patchItemStatusById), itemController.patchItemStatusById);
router.put('/:itemId', validate(itemValidation.updateItemById), itemController.updateItemById);
router.get('/:itemId', validate(itemValidation.getItemById), itemController.getItemById);

module.exports = router;
