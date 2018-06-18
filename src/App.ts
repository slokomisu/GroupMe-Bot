import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import Raven from './utils/RavenLogger';
import * as helmet from 'helmet'
import groupMeRoutes from './routes/groupme-routes'

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.initializeMiddleware();
    this.mountRoutes();
  }

  private initializeMiddleware() {
    this.express.use(Raven.errorHandler());
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(bodyParser.json());
  }

  private mountRoutes(): void {
    this.express.use('/', groupMeRoutes)
  }
}

export default new App().express;
