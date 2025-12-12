class State {
  mongo = undefined;
  app = undefined;
  websocketServer = undefined;
  // server;

  get mongo() {
    return this.mongo;
  }

  set mongo(mongoInstance) {
    this.mongo = mongoInstance;
  }

  get app() {
    return this.app;
  }

  set app(appInstance) {
    this.app = appInstance;
  }

  // get server() {
  //   return this.server;
  // }

  // set server(serverInstance) {
  //   this.server = serverInstance;
  // }

  get websocketServer() {
    return this.websocketServer;
  }

  set websocketServer(websocketServerInstance) {
    this.websocketServer = websocketServerInstance;
  }

  kill() {
    if (this.mongo) this.mongo.disconnect();
    if (this.app) this.app.close();
    // this.server.close();
    // Close websocket server if exists
  }
}

module.exports = new State();
