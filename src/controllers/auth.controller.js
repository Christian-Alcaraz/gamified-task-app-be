const httpStatus = require('http-status').status;
const { TOKEN } = require('../constants');
const User = require('../models/user.model');
const { authService, tokenService, refreshTokenService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const cookieUtils = require('../utils/cookieUtils');
const dateUtils = require('../utils/dateUtils');

const createUserTokens = async (user) => {
  const userId = user._id;

  const authToken = tokenService.generateAuthToken(userId);
  const latestRefreshToken = await refreshTokenService.getLatestRefreshTokenByUserId(userId);
  if (latestRefreshToken) {
    await refreshTokenService.revokeRefreshTokenById(latestRefreshToken._id);
  }

  const refreshToken = await refreshTokenService.createRefreshTokenByUserId(userId);

  return { token: authToken, refreshToken };
};

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);

  const { token, refreshToken } = await createUserTokens(user);

  res.cookie(TOKEN.REFRESH_COOKIE, refreshToken.token, cookieUtils.getCookieOptionsWithExpiry(refreshToken.expiresAt));
  res.status(httpStatus.CREATED).send({ ...user.toJSON(), token });
});

// Todo: Create cache db for logged in users for activity?
const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const { token, refreshToken } = await createUserTokens(user);
  const cookieOpts = cookieUtils.getCookieOptionsWithExpiry(refreshToken.expiresAt);
  res.cookie(TOKEN.REFRESH_COOKIE, refreshToken.token, cookieOpts);

  res.status(httpStatus.OK).send({ ...user.toJSON(), token });
});

const refreshUserAuthToken = catchAsync(async (req, res) => {
  const refreshTokenFromCookie = req.cookies[TOKEN.REFRESH_COOKIE];
  if (!refreshTokenFromCookie) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate again'));
  }

  const refreshTokenFromDb = await refreshTokenService.getRefreshToken(refreshTokenFromCookie);
  if (!refreshTokenFromDb || refreshTokenFromDb?.revokedAt || dateUtils.isExpired(refreshTokenFromDb.expiresAt)) {
    res.cookie(TOKEN.REFRESH_COOKIE, '', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 0 });
    res.status(httpStatus.UNAUTHORIZED).send('Please authenticate again');
  }

  await refreshTokenService.revokeRefreshTokenById(refreshTokenFromDb._id);
  const userId = refreshTokenFromDb._userId;
  const authToken = tokenService.generateAuthToken(userId);
  const refreshToken = await refreshTokenService.createRefreshTokenByUserId(userId);

  res.cookie(TOKEN.REFRESH_COOKIE, refreshToken.token, cookieUtils.getCookieOptionsWithExpiry(refreshToken.expiresAt));
  res.status(httpStatus.OK).send({ token: authToken });
});

const me = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  res.status(httpStatus.OK).send(user.toJSON());
});

// Todo: Nice
const logoutUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const refreshTokenCookie = req.cookies;

  // await authService.logoutUser(userId);

  res.cookie(TOKEN.REFRESH_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 0 });
  res.status(httpStatus.OK).send();
});

module.exports = { registerUser, loginUserWithEmailAndPassword, me, logoutUser, refreshUserAuthToken };
