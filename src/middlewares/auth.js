const passport = require('passport');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants');

const authorize =
  (...userTypes) =>
  async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (info?.name === 'TokenExpiredError') {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token Expired'));
      } else if (info) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request'));
      }

      if (err || !user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request'));
      }

      req.user = user;

      if (req.user.status !== STATUS.ACTIVE) {
        return next(
          new ApiError(httpStatus.UNAUTHORIZED, 'Your account is inactive. Please contact your System Administrator'),
        );
      }

      // const role = await Role.findById(req.user._roleId);
      // if (role) {
      //   req.permissions = role.permissions;
      // }

      // if (userTypes?.length && !userTypes.includes(req.user.userType)) {
      //   return next(new ApiError(httpStatus.FORBIDDEN, 'Access Forbidden'));
      // }

      next();
    })(req, res, next);
  };

module.exports = authorize;
