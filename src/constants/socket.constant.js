const SOCKET_TYPE = {
  MESSAGE: 'message',
  CHAT_MESSAGE: 'chat_message',
  ERROR: 'error',
  SUCCESS: 'success',
  TOKEN_EXPIRED: 'token_expired',
  REAUTH: 'reauthenticate',
  DISCONNECT: 'disconnect',
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

const SOCKET_TYPES = Object.values(SOCKET_TYPE);
const SOCKET_TARGETS = Object.values(SOCKET_TARGET);
const SOCKET_SUB_TARGETS = Object.values(SOCKET_SUB_TARGET);
const WS_STATUSES = Object.values(WS_STATUS);
const CLIENT_STATUSES = Object.values(CLIENT_STATUS);

module.exports = {
  SOCKET_TYPE,
  SOCKET_TYPES,
  SOCKET_TARGET,
  SOCKET_TARGETS,
  SOCKET_SUB_TARGET,
  SOCKET_SUB_TARGETS,
  WS_STATUS,
  WS_STATUSES,
  CLIENT_STATUS,
  CLIENT_STATUSES,
};
