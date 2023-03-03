import { Application } from "express";

import * as http from "http";

export default class Server {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  /**
   * This function takes a function as an argument, and then calls that function, passing in the app
   * object.
   * @param configFunction - This is a function that takes an Application as a parameter.
   * @returns The instance of the class.
   */
  globalConfig(configFunction: (app: Application) => void) {
    configFunction(this.app);
    return this;
  }

  /**
   * This function takes a function as an argument, and calls that function with the app as an argument.
   * @param routes - (app: Application) => void
   * @returns The instance of the class.
   */
  router(routes: (app: Application) => void) {
    routes(this.app);
    return this;
  }

  /**
   * It creates a server and listens on the given port and hostname.
   * @param {number} port - The port number on which the server will listen.
   * @param {string} hostname - The hostname to listen on. Defaults to localhost.
   * @returns The application object.
   */
  listen(port: number, hostname: string): Application {
    http.createServer(this.app).listen(port, hostname, () => {
      console.log(`⭐Server running and listen on http://${hostname}:${port} `);
    });
    return this.app;
  }
}
