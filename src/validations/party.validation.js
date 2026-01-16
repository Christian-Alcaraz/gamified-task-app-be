const Joi = require('joi');
const { ITEM, STATUSES } = require('../constants');
const JoiObjectId = require('./helpers/mongoObjectId');

const PartyMember = Joi.object().keys({
  name: Joi.string().required().description('Party Member name'),
  id: JoiObjectId().required().description('Party Member id'),
});

const PartyBody = {
  name: Joi.string().required().description('Party name'),
  description: Joi.string().allow('', null).description('Party description'),
  imageUrl: Joi.string().allow('', null).description('Party ImageURL (WIP, must setup s3 first)'),
  leader: PartyMember.description('Party leader'),
  members: Joi.array().items(PartyMember).required().description('Party members'),
  public: Joi.boolean().description('Party Publicity'),
};

const validation = {
  createParty: {
    body: Joi.object().keys(PartyBody),
  },
  updatePartyById: {
    params: Joi.object().keys({
      itemId: JoiObjectId().required().description('Party ID'),
    }),
    body: Joi.object().keys(PartyBody),
  },
  getPartyById: {
    params: Joi.object().keys({
      itemId: JoiObjectId().required().description('Party ID'),
    }),
  },
  getPartyByCode: {
    params: Joi.object().keys({
      code: Joi.string().required().description('Party Code'),
    }),
  },
  getParties: {
    query: Joi.object().keys({
      pageIndex: Joi.number().description('Page number'),
      pageSize: Joi.number().min(1).max(100).default(10).description('Partys per page'),
      sort: Joi.alternatives()
        .try(Joi.valid(null), Joi.string().allow('').pattern(new RegExp('^\\w+:(asc|desc)$')))
        .optional()
        .description('Party Sort Query'),
      search: Joi.string().allow('', null).description('Search term'),
      code: Joi.string().allow('', null).description('Party Code'),
      name: Joi.string().allow('', null).description('Party name'),
      public: Joi.boolean().description('Party Publicity'),
      status: Joi.string()
        .valid(...STATUSES)
        .description('Party status'),
    }),
  },
};

module.exports = validation;
