const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants');
const { Role } = require('../models');

const authorize =
  (...userTypes) =>
  async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err || info || !user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }

      req.user = user;

      if (req.user.status !== STATUS.ACTIVE) {
        return next(
          new ApiError(httpStatus.UNAUTHORIZED, 'Your account is inactive. Please contact your System Administrator'),
        );
      }

      const role = await Role.findById(req.user._roleId);
      if (role) {
        req.permissions = role.permissions;
      }

      if (userTypes?.length && !userTypes.includes(req.user.userType)) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access Forbidden'));
      }

      next();
    })(req, res, next);
  };

module.exports = authorize;
