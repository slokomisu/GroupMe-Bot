import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as Raven from 'raven';
import * as helmet from 'helmet'
import groupMeRoutes from './routes/groupme-routes'

class App {
  public express: express.Application;
  private raven;

  constructor() {
    this.express = express();
    this.initializeMiddleware();
    this.mountRoutes();
    this.raven = Raven.config(process.env.DSN).install();
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
