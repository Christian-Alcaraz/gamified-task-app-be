const User = require('../models/user.model');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(httpStatus.CREATED).json({ user: user.toJSON() });
  } catch (error) {
    console.error('Error in register:', error);
    next(error);
  }
};
