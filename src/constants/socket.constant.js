const SOCKET_TYPE = {
  MESSAGE: 'message',
  CHAT_MESSAGE: 'chat_message',
  ERROR: 'error',
  SUCCESS: 'success',
  TOKEN_EXPIRED: 'token_expired',
  REAUTH: 'reauthenticate',
};

const SOCKET_TARGET = {
  CHAT: 'chat',
};

const SOCKET_SUB_TARGET = {
  SEND: 'send',
  GET: 'get',
  READ: 'read',
  GET_UNREAD: 'get_unread',
};

const CLIENT_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  TOKEN_EXPIRED: 'token_expired',
};

const WS_STATUS = {
  NORMAL_CLOSURE: 1000,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  POLICY_VIOLATION: 1008,
  INTERNAL_ERROR: 1011,
};

module.exports = {
  SOCKET_TYPE,
  SOCKET_TARGET,
  SOCKET_SUB_TARGET,
  WS_STATUS,
  CLIENT_STATUS,
};
