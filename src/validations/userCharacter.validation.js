const Joi = require('joi');
const { isCharacterNameTaken } = require('../services/userCharacter.service');
const { SEXES } = require('../constants');

const Character = {
  name: Joi.string().required().description('Character name'),
  imageUrl: Joi.string().required().description('Character image url'),
  class: Joi.string().required().description('Character class'),
  gender: Joi.string()
    .valid(...SEXES)
    .required()
    .description('Character gender'),
  // skinColor: Joi.string().required().description('Character skin color'),
  // head: Joi.object().keys({
  //   hairBase: Joi.string().required().description('Character head hair base'),
  //   hairColor: Joi.string().required().description('Character head hair color'),
  // }),
  // face: Joi.object().keys({
  //   eyeBase: Joi.string().required().description('Character face eye base'),
  //   eyeColor: Joi.string().required().description('Character face eye color'),
  //   facialHairBase: Joi.string().required().description('Character face facial hair base'),
  //   facialHairColor: Joi.string().required().description('Character face facial hair color'),
  // }),
  // body: Joi.object().keys({
  //   color: Joi.string().required().description('Character body color'),
  //   base: Joi.string().required().description('Character body base'),
  // }),
  // accessories: Joi.object().keys({
  //   head: Joi.string().required().description('Character accessories head'),
  //   face: Joi.string().required().description('Character accessories face'),
  //   waist: Joi.string().required().description('Character accessories waist'),
  //   back: Joi.string().required().description('Character accessories back'),
  //   mount: Joi.string().required().description('Character accessories mount'),
  // }),
};

const validation = {
  patchCreateUserCharacterById: {
    body: Joi.object().keys({
      character: Joi.object()
        .keys({ ...Character })
        .description('User Character'),
    }),
  },
  updateUserCharacterById: {
    body: Joi.object().keys({
      character: Joi.object()
        .keys({ ...Character })
        .description('User Character'),
    }),
  },
  isCharacterNameTaken: {
    body: Joi.object().keys({
      name: Joi.string().required().description('Character name'),
    }),
  },
};

module.exports = validation;
