import GroupMeBot from '../bot/GroupMeBot'
import { IGroupMeMessage } from '../types'

async function groupMeCallback (req, res) {
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

export default groupMeCallback
