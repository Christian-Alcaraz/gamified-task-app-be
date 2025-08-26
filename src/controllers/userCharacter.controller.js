const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const { userCharacterService } = require('../services');

const patchCreateUserCharacterById = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const characterBody = req.body.character;
  const user = await userCharacterService.patchCreateUserCharacterById(userId, characterBody);
  res.status(httpStatus.OK).send(user);
});

const updateUserCharacterById = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const characterBody = req.body.character;
  const user = await userCharacterService.updateUserCharacterById(userId, characterBody);
  res.status(httpStatus.OK).send(user);
});

const isCharacterNameTaken = catchAsync(async (req, res, next) => {
  const characterName = req.body.name;
  const isTaken = await userCharacterService.isCharacterNameTaken(characterName);
  res.status(httpStatus.OK).send(isTaken);
});

module.exports = {
  patchCreateUserCharacterById,
  updateUserCharacterById,
  isCharacterNameTaken,
};
