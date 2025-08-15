const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJSON = require('./plugins/toJSON');
const { USER_TYPE, USER_TYPES, STATUSES, STATUS, OAUTH_TYPE, OAUTH_TYPES } = require('../constants');

/**
 * @typedef {Object} OAuth
 * @property {OAUTH_TYPE} serviceType
 * @property {mongoose.Types.ObjectId} _oauthId
 */

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} [password]
 * @property {USER_TYPE} type
 * @property {STATUS} status
 * @property {OAuth} [oauth]
 */

/** @type {mongoose.Schema<User>} */
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    type: {
      type: String,
      default: USER_TYPE.USER,
      enums: USER_TYPES,
    },
    status: {
      type: String,
      default: STATUS.ACTIVE,
      enum: STATUSES,
    },
    oauth: {
      serviceType: {
        type: String,
        enum: OAUTH_TYPES,
      },
      _oauthId: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/** @type {mongoose.Model<User>} */
const User = mongoose.model('User', userSchema);

module.exports = User;
