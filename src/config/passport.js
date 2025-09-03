const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { User } = require('../models');
const { STATUS, TOKEN_TYPE } = require('../constants');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      return done(null, false);
    }

    const user = await User.findOne({
      _id: payload.sub,
      status: STATUS.ACTIVE,
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
