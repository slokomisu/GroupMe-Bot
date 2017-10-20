import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { GroupMeBot } from './bot/bot'
import { GroupMeMessage } from './types'

class App {
  public express: express.Application;
  private bot: GroupMeBot;

  constructor () {
    this.express = express()
    this.initializeMiddleware();
    this.mountRoutes()
    this.bot = new GroupMeBot(process.env.BOT_ID, process.env.ACCESS_TOKEN);
  }

  private initializeMiddleware() {
    this.express.use(helmet())
    this.express.use(cors())
    this.express.use(bodyParser.json());
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.post('/callback', async (req, res) => {
      const message: GroupMeMessage = req.body;
      const messageSent = await this.bot.processMessage(message);
    })
    this.express.use('/', router)
  }
}

export default new App().express