const config = require('../../config/config');
const { SOCKET_TYPE } = require('../../constants');

class Router {
  registerRoutes() {
    this.socket.on('hello', (data) => {
      console.log(data);
    });
  }

  handleError(err, socket) {
    if (config.env !== 'production') {
      console.trace(err);
    }

    const { message, statusCode, name } = err;

    const body = JSON.stringify({
      message,
      code: statusCode,
      name,
    });

    socket.emit(SOCKET_TYPE.ERROR, body);
  }
}

module.exports = Router;
