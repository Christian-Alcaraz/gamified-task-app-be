/**
 * @typedef {Object} ISocketInMessage
 * @property {string} target
 * @property {string} subTarget
 * @property {Object} payload
 */

/**
 * @typedef {Object} ISocketOutMessage
 * @property {string} type
 * @property {unknown} payload
 */

/**
 * @typedef {Object} ISocketSendMessageDto
 * @property {string} sender
 * @property {string} receiver
 * @property {string} body
 * @property {string} conversationId
 */

/**
 * @typedef {Object} ISocketSendMessageBody
 * @property {string} target
 * @property {string} message
 * @property {string} conversationId
 */

/**
 * @typedef {Object} ISocketGetMessageBody
 * @property {number} page
 * @property {string} conversationId
 *
 */

/**
 * @typedef {Object} ISocketGetDetailedBody
 * @property {number} page
 * @property {string} target
 *
 */

/**
 * @typedef {Object} ISocketReadMessageBody
 * @property {string} messageId
 * @property {string} userId
 *
 */

/**
 *
 */

module.exports = {};
