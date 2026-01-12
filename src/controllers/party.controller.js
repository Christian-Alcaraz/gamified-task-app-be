const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { partyService } = require('../services');

const createParty = catchAsync(async (req, res, next) => {
  const body = req.body;
  const partyDocument = await partyService.createParty(body);
  res.status(httpStatus.CREATED).send(partyDocument);
});

const getPartyById = catchAsync(async (req, res, next) => {
  const { partyId } = req.params;
  const partyDocument = await partyService.getPartyById(partyId);

  if (!partyDocument) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Party not found'));
  }

  res.status(httpStatus.OK).send(partyDocument);
});

const getPartyByCode = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const partyDocument = await partyService.getPartyByCode(code);

  if (!partyDocument) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Party not found'));
  }

  res.status(httpStatus.OK).send(partyDocument);
});

const getParties = catchAsync(async (req, res, next) => {
  const { records, total } = await partyService.getParties(req.query);
  res.status(httpStatus.OK).send({ records, total });
});

const updatePartyById = catchAsync(async (req, res, next) => {
  const { partyId } = req.params;
  const body = req.body;
  const partyDocument = await partyService.updatePartyById(body, partyId);

  res.status(httpStatus.OK).send(partyDocument);
});

module.exports = {
  createParty,
  getPartyById,
  getPartyByCode,
  getParties,
  updatePartyById,
};
