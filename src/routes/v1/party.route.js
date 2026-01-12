const express = require('express');
const authorize = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { partyController } = require('../../controllers');
const { partyValidation } = require('../../validations');

const router = express.Router();

router.use(authorize());

router
  .route('/')
  .get(validate(partyValidation.getParties), partyController.getParties)
  .post(validate(partyValidation.createParty), partyController.createParty);

// router.patch('/status', validate(partyValidation.patchPartyStatusById), partyController.patchPartyStatusById);
router.put('/:partyId', validate(partyValidation.updatePartyById), partyController.updatePartyById);
router.get('/:partyId', validate(partyValidation.getPartyById), partyController.getPartyById);
router.get('/code/:code', validate(partyValidation.getPartyByCode), partyController.getPartyByCode);

module.exports = router;
