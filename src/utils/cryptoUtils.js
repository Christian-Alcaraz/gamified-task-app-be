const crypto = require('crypto');
const config = require('../config/config');

const algorithm = 'aes-256-gcm';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(config.appEncryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('hex'), encryptedText: encrypted, tag: tag.toString('hex') };
};

const decrypt = ({ iv, encryptedText, tag }) => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(config.appEncryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

const createHash = (text) => {
  const hashAlgorithm = 'sha256';
  const hash = crypto.createHash(hashAlgorithm, config.appEncryptionKey).update(text).digest('hex');
  return hash;
};

module.exports = {
  encrypt,
  decrypt,
  createHash,
};
