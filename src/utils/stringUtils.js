const crypto = require('crypto');

const generatePassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
  let password = '';
  while (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
    password = Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((x) => charset[x % charset.length])
      .join('');
  }

  return password;
};

const generateUniqueString = () => {
  return crypto.randomBytes(16).toString('hex');
};

const isIdEqual = (id1, id2) => {
  return id1.toString() === id2.toString();
};

const isIdNotEqual = (id1, id2) => {
  return id1.toString() !== id2.toString();
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  generatePassword,
  generateUniqueString,
  isIdEqual,
  isIdNotEqual,
  escapeRegExp,
};
