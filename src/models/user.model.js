const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJSON = require('./plugins/toJSON');
const { USER_TYPE, USER_TYPES, STATUSES, STATUS, OAUTH_TYPE, OAUTH_TYPES, SEXES } = require('../constants');

/**
 * @typedef {Object} OAuth
 * @property {OAUTH_TYPE} serviceType
 * @property {mongoose.Types.ObjectId} _oauthId
 */

/**
 * @typedef {Object} Character
 * @property {string} name
 * @property {string} skinColor
 * @property {string} imageUrl
 * @property {string} class
 * @property {Object} head
 * @property {string} head.hairBase
 * @property {string} head.hairColor
 * @property {Object} face
 * @property {string} face.eyeBase
 * @property {string} face.eyeColor
 * @property {string} face.facialHairBase
 * @property {string} face.facialHairColor
 * @property {Object} body
 * @property {string} body.color
 * @property {string} body.base
 * @property {Object} accessories
 * @property {string} accessories.head
 * @property {string} accessories.face
 * @property {string} accessories.waist
 * @property {string} accessories.back
 * @property {string} accessories.mount
 */

/**
 * @typedef {Object} Stats
 * @property {string} health
 * @property {string} mana
 * @property {string} strength
 * @property {string} dexterity
 * @property {string} intelligence
 * @property {string} constitution
 * @property {string} experience
 * @property {string} level
 * @property {string} statPoints
 * @property {string} toNextLevel
 */

/**
 * @typedef {Object} Equipment
 * @property {string} head
 * @property {string} face
 * @property {string} body
 * @property {string} accessories
 * @property {string} mainHand
 * @property {string} offHand
 */

/**
 * @typedef {Object} Preferences
 * @property {string} theme
 */

/**
 * @typedef {Object} Flags
 * @property {boolean} hasCreatedCharacter
 * @property {boolean} hasAcceptedTerms
 */

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} [password]
 * @property {USER_TYPE} type
 * @property {STATUS} status
 * @property {OAuth} [oauth]
 * @property {Character} [character]
 * @property {Stats} [stats]
 * @property {Equipment} [equipment]
 * @property {Preferences} [preferences]
 * @property {Flags} [flags]
 *
 */

/** @typedef {mongoose.Document<mongoose.Types.ObjectId, {}, User> & User} UserDocument */

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
    character: {
      name: String,
      imageUrl: String, // ? for the meantime; in the future, we will have layered images using pixi js for much more customization
      class: String,
      skinColor: String,
      gender: {
        type: String,
        enum: SEXES,
      },
      head: {
        hairBase: String,
        hairColor: String,
      },
      face: {
        eyeBase: String,
        eyeColor: String,
        facialHairBase: String,
        facialHairColor: String,
      },
      body: {
        color: String,
        base: String,
      },
      accessories: {
        head: String,
        face: String,
        waist: String,
        back: String,
        mount: String,
      },
    },
    stats: {
      health: Number,
      mana: Number,
      strength: Number,
      dexterity: Number,
      intelligence: Number,
      constitution: Number,
      experience: Number,
      level: Number,
      statPoints: Number,
      toNextLevel: Number,
    },
    equipment: {
      head: String,
      face: String,
      body: String,
      accessories: String,
      mainHand: String,
      offHand: String,
    },
    preferences: {
      theme: String,
    },
    flags: {
      hasCreatedCharacter: {
        type: Boolean,
        default: false,
      },
      hasAcceptedTerms: {
        type: Boolean,
        default: false,
      },
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
