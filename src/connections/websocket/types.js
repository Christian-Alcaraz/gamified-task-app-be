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
 * @property {string} chatRoomId
 */

/**
 * @typedef {Object} ISocketSendMessageBody
 * @property {string} target
 * @property {string} message
 * @property {string} chatRoomId
 */

/**
 * @typedef {Object} ISocketGetMessageBody
 * @property {number} page
 */

/**
 * @typedef {Object} ISocketGetDetailedBody
 * @property {number} page
 * @property {string} target
 */

/**
 * @typedef {Object} ISocketReadMessageBody
 * @property {string} chatId
 * @property {string} userId
 */

/**
 *
 */

module.exports = {};
