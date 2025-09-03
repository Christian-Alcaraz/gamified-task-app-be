const express = require('express');
const authorize = require('../../middlewares/auth');
const { configController } = require('../../controllers');

const router = express.Router();

router.use(authorize());

router.route('/classes').get(configController.getClassesFromConfig);
router.route('/:configName').get(configController.getConfigByName);

module.exports = router;
