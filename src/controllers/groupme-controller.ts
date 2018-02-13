import GroupMeBot from '../bot/GroupMeBot'
import { IGroupMeMessage } from '../types'
import { Request, Response } from 'express'
import { itsTime } from '../tasks/its-time';

async function groupMeCallback (req: Request, res: Response) {
  const botId = req.query.botId
  const message: IGroupMeMessage = req.body
  const bot = new GroupMeBot(botId, process.env.ACCESS_TOKEN)
  const messageSent = await bot.processMessage(message)
  if (!messageSent) {
    res.sendStatus(204)
  } else {
    res.sendStatus(200)
  }
}

async function itsTimeCallback(req: Request, res: Response) {
  const botId = req.query.botId
  const message: IGroupMeMessage = req.body
  const bot = new GroupMeBot(botId, process.env.ACCESS_TOKEN)
  const messageSent = await itsTime(bot)
  if (!messageSent) {
    res.sendStatus(204)
  } else {
    res.sendStatus(200)
  }
}

export { groupMeCallback, itsTimeCallback }
