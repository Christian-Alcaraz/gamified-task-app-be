const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const stringUtils = require('../utils/stringUtils');
const { PARTY_CODE_CHARSET, PARTY_CODE_LENGTH } = require('../constants');
const { Party } = require('../models');

/** @typedef {import('../models/party.model').Party} Party */
/** @typedef {import('../models/party.model').PartyDocument} PartyDocument */

/**
 * Create Party
 * @param {Partial<Party>} partyBody
 * @returns {Promise<PartyDocument>}
 */
const createParty = async (partyBody) => {
  let code;

  do {
    code = stringUtils.generateStringFromCharset(PARTY_CODE_LENGTH, PARTY_CODE_CHARSET);
  } while (await getPartyByCode(code));

  /** @type {Partial<Party>} */
  const body = {
    ...partyBody,
    code,
  };

  const party = await Party.create(body);
  return party;
};

/**
 *  Find and get party by id
 * @param {string} partyId
 * @returns {Promise<PartyDocument>}
 */
const getPartyById = async (partyId) => {
  return Party.findById(partyId);
};

/**
 * Find and get party by code
 * @param {string} code
 * @returns
 */
const getPartyByCode = async (code) => {
  return Party.findOne({ code });
};

/**
 * Get Parties via req.query
 * @param {any} query
 * @returns
 */
const getParties = async (query) => {
  const { pageIndex, pageSize, sort, search, name, code, isPublic, status } = query;

  const filter = {};

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [{ name: { $regex: searchRegex } }, { code: { $regex: searchRegex } }];
  } else {
    if (name) {
      filter.name = { name: { $regex: `.*${name}.*`, $options: 'i' } };
    }
    if (code) {
      filter.code = { code: { $regex: `.*${code}.*`, $options: 'i' } };
    }
    if (typeof isPublic === 'boolean') {
      filter.isPublic = isPublic;
    }
    if (status) {
      filter.status = { status: { $regex: `.*${status}.*`, $options: 'i' } };
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

/**
 * Updates Party info
 * @param {Partial<Party>} partyBody
 * @param {string} partyId
 * @returns
 */
const updatePartyById = async (partyBody, partyId) => {
  const party = await getPartyById(partyId);

  if (!party) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Party not found');
  }

  Object.assign(party, partyBody);
  await party.save();
  return party;
};

/**
 * Updates Party Status
 * @param {string} partyId
 * @param {string} status
 * @returns
 */
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
