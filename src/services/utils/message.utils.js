/** @typedef {import('../../models/message.model').MessageDocument} MessageDocument */
/** @typedef {import('../../models/message.model').Message} Message */

/**
 *
 * @param {MessageDocument[]} messages
 * @param {string} userId
 * @returns
 */
const formUnreadMessages = async (messages, userId) => {
  const prepared = [];

  messages.forEach((/** @type {Message} */ d) => {
    if (d.receivedBy.userId.toString() !== userId) return;
    const chatRoomId = typeof d._chatRoomId === 'string' ? d._chatRoomId : d._chatRoomId.toString();

    prepared[chatRoomId] === undefined
      ? (prepared[chatRoomId] = {
          chatId: chatRoomId,
          lastMessage: Date.parse(d.createdAt).valueOf(),
          unreadMessages: 0,
          participants: [d.receivedBy.userId, d.createdBy.userId],
        })
      : null;

    prepared[chatRoomId].unreadMessages++;
    prepared[chatRoomId].lastMessage = Date.parse(d.createdAt).valueOf();
  });

  return Object.values(prepared);
};
