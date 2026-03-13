/** @typedef {import('../connections/app')} ExpressApp */
/** @typedef {import('../connections/websocket')} WebsocketServer */
/** @typedef {import('../connections/mongo').Mongo} Mongo */
class State {
  /** @type {Mongo} */
  _mongo = undefined;

  /** @type {ExpressApp} */
  _app = undefined;

  /** @type {WebsocketServer} */
  _websocketServer = undefined;

  /**
   * @param {Mongo} mongoInstance
   */
  set mongo(mongoInstance) {
    this._mongo = mongoInstance;
  }

  /**
   * @returns {Mongo}
   */
  get mongo() {
    return this._mongo;
  }
  get app() {
    return this._app;
  }

  set app(appInstance) {
    this._app = appInstance;
  }

  get websocketServer() {
    return this._websocketServer;
  }

  set websocketServer(websocketServerInstance) {
    this._websocketServer = websocketServerInstance;
  }

  kill() {
    if (this.mongo) /** @type {Mongo} */ (this.mongo).disconnect();
    if (this.websocketServer) this.websocketServer.close();
    if (this.app) this.app.close();
    // this.server.close();
    // Close websocket server if exists
  }
}

module.exports = new State();
