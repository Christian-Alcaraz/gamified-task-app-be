const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const stringUtils = require('../utils/stringUtils');
const { PARTY_CODE_CHARSET, PARTY_CODE_LENGTH } = require('../constants');
const { Party } = require('../models');

const createParty = async (partyBody) => {
  const code = stringUtils.generateStringFromCharset(PARTY_CODE_LENGTH, PARTY_CODE_CHARSET);
  const body = {
    ...partyBody,
    code,
  };

  const party = await Party.create(body);
  return party;
};

const getPartyById = async (partyId) => {
  return Party.findById(partyId);
};

const getPartyByCode = async (code) => {
  return Party.findOne({ code });
};

const getParties = async (query) => {
  const { pageIndex, pageSize, sort, search, name, code, public, status } = query;

  const filter = {};

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [{ name: { $regex: searchRegex } }, { code: { $regex: searchRegex } }];
  } else {
    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }
    if (code) {
      filter.code = { $regex: new RegExp(code, 'i') };
    }
    if (public) {
      filter.public = public;
    }
    if (status) {
      filter.status = status;
    }
  }

  const sortBy = {};
  if (sort) {
    const [path, direction] = sort.split(':');
    sortBy[path] = direction === 'desc' ? -1 : 1;
  } else {
    sortBy['createdAt'] = -1;
  }

  const parties = await Party.find(filter)
    .sort(sortBy)
    .skip(pageSize * pageIndex)
    .limit(pageSize || 9999);

  const totalItems = await Party.countDocuments(filter);
  return { records: parties, total: totalItems };
};

const updatePartyById = async (partyBody, partyId) => {
  const party = await getPartyById(partyId);

  if (!party) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Party not found');
  }

  Object.assign(party, partyBody);
  await party.save();
  return party;
};

const patchPartyStatusById = async (partyId, status) => {
  const party = await getPartyById(partyId);
  if (!party) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Party not found');
  }

  party.status = status;
  await party.save();
  return party;
};

module.exports = {
  createParty,
  getPartyById,
  getPartyByCode,
  getParties,
  updatePartyById,
  patchPartyStatusById,
};
