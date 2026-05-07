const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJSON = require('./plugins/toJSON');
const { USER_TYPE, USER_TYPES, STATUSES, STATUS, SEXES } = require('../constants');

/** @typedef {import('../types').IPartyLog} IPartyLog */

/**
 * @typedef {Object} OAuth
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
 * @property {number} health
 * @property {number} mana
 * @property {number} strength
 * @property {number} dexterity
 * @property {number} intelligence
 * @property {number} constitution
 * @property {number} experience
 * @property {number} level
 * @property {number} gold
 * @property {number} statPoints
 * @property {number} toNextLevel
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
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {string} email
 * @property {string} [name]
 * @property {string} [password]
 * @property {string} type
 * @property {string} status
 * @property {OAuth} [oauth]
 * @property {Character} [character]
 * @property {Stats} [stats]
 * @property {Equipment} [equipment]
 * @property {Preferences} [preferences]
 * @property {Flags} [flags]
 * @property {IPartyLog} [party]
 * @property {Object} [updatedBy]
 */

/** @typedef {mongoose.Document & User & UserMethods} UserDocument */

/**
 * @typedef {Object} UserMethods
 * @property {(password: string) => Promise<boolean>} isPasswordMatch
 * @property {(email: string) => Promise<boolean>} isEmailTaken
 */

/** @type {mongoose.Schema<UserDocument>} */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      /** @type {(value: string) => void} */
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    name: { type: String },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      /** @type {(value: string) => void} */
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
    // oauth: {
    //   serviceType: {
    //     type: String,
    //     enum: OAUTH_TYPES,
    //   },
    //   _oauthId: String,
    // },
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
      gold: Number,
      statPoints: Number,
      toNextLevel: Number,
      maxHealth: Number,
      maxMana: Number,
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
    party: {
      name: String,
      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
      },
    },
    updatedBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(toJSON);

/**
 * Method to check if email is taken
 * @this {mongoose.Model<UserDocument>}
 * @param {string} email
 * @param {string} excludeUserId
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Method to check if password matches the user's password
 * @this {UserDocument}
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.password) {
    throw new Error("User password is missing, shouldn't be possible");
  }

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/** @type {mongoose.Model<UserDocument>} */
const User = mongoose.model('User', userSchema);

module.exports = User;
