import axios from 'axios'
import Message from '../Models/Message'
import BasicResponseTrigger from '../responses/BasicResponseTrigger'
import EverybodyResponseTrigger from '../responses/EverybodyResponseTrigger'
import LineResponseTrigger from '../responses/LineResponseTrigger'
import WeatherResponseTrigger from '../responses/WeatherResponseTrigger'
import {
  IBotResponse,
  IGroupMeMessage,
  IMessageRequest,
  IResponseTrigger,
  SenderType,
} from '../types'
import NoNutNovemberResponseTrigger from '../responses/NoNutNovemberResponseTrigger'
import { BaseTrigger } from '../responses/BaseTrigger'

export default class GroupMeBot {
  private botId: string
  private accessToken: string
  private responseTriggers: IResponseTrigger[]

  constructor (botId: string, accessToken: string) {
    this.botId = botId
    this.accessToken = accessToken
    this.registerResponseTriggers()
  }

  public async processMessage (message: IGroupMeMessage): Promise<IBotResponse> {
    console.log(message)
    let response: IBotResponse
    if (message.attachments) {
      console.log(message.attachments)
      console.log(message.attachments[0])
    }

    // await this.addMessageToCreepDB(message);
    if (message.sender_type === SenderType.Bot) {
      return undefined
    }

    const triggers = this.findTriggers(message.text)
    if (!triggers) {
      return undefined
    }
    let responseSent = false

    triggers.forEach(async trigger => {
      response = await trigger.respond(message)
      if (response) {
        responseSent = await this.sendMessage(response)
      }
    })
    return response
  }

  private registerResponseTriggers () {
    this.responseTriggers = [
      new EverybodyResponseTrigger(this.accessToken),
      new WeatherResponseTrigger(),
      new LineResponseTrigger(),
      new NoNutNovemberResponseTrigger(),
      new BasicResponseTrigger([/nani/, /何/],
        'OMAE WA MOU SHINDERU\n\n💥💥💥💥💥💥💥'),
      new BasicResponseTrigger([/PARTY ROCKERS IN THE HOU/], 'SE TONIGHT'),
    ]
  }

  private async addMessageToCreepDB (message: IGroupMeMessage) {
    await Message.create({
      created_at: new Date(),
      group_id: message.group_id,
      id: message.id,
      name: message.name,
      sender_id: message.sender_id,
      text: message.text,
    })
  }

  private findTriggers (messageText: string): IResponseTrigger[] | null {
    const triggers: IResponseTrigger[] = []
    for (const trigger of this.responseTriggers) {
      if (trigger.isTrigger(messageText)) {
        triggers.push(trigger)
      }
    }

    return triggers.length > 0 ? triggers : null
  }

  private async sendMessage (response: IBotResponse): Promise<boolean> {
    let messageRequest: IMessageRequest

    if (response.attachments) {
      messageRequest = {
        attachments: [response.attachments],
        bot_id: this.botId,
        text: response.responseText,
      }
    } else {
      messageRequest = {
        bot_id: this.botId,
        text: response.responseText,
      }
    }

    try {
      const request = await axios.post('https://api.groupme.com/v3/bots/post',
        messageRequest)
      console.log(messageRequest)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
