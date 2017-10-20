import axios from 'axios'
import {
  BotResponse,
  GroupMeMessage,
  IResponseTrigger,
  MessageRequest,
  SenderType,
} from '../types'
import { EverybodyResponseTrigger } from '../responses/EverybodyResponseTrigger'
import { WeatherResponseTrigger } from '../responses/WeatherResponseTrigger'
import { BasicResponse } from '../responses/BasicResponse'
import { LineResponse } from '../responses/LineResponse'
import Message from '../Models/Message'

export class GroupMeBot {
  private botId: string
  private accessToken: string
  private responseTriggers: IResponseTrigger[]

  constructor (botId: string, accessToken: string) {
    this.botId = botId
    this.accessToken = accessToken
    this.responseTriggers = [
      new EverybodyResponseTrigger(this.accessToken),
      new WeatherResponseTrigger(),
      new LineResponse(['line', 'LB'], 'IT\'S A PROBATIONARY CLASS MATT'),
      new BasicResponse(['NUT', '🥜'], '👀😤😩💦💦👅💯'),
      new BasicResponse(['nani', '何'],
        'OMAE WA MOU SHINDERU\n\n💥💥💥💥💥💥💥'),
      new BasicResponse(['PARTY ROCKERS IN THE HOU'], 'SE TONIGHT'),
    ]
  }

  public async processMessage (message: GroupMeMessage): Promise<boolean> {
    Message.create({
      id: message.id,
      created_at: new Date(),
      group_id: message.group_id,
      name: message.name,
      sender_id: message.sender_id,
      text: message.text,
    })
    if (message.sender_type === SenderType.Bot) {
      return false
    }

    const trigger = this.findTrigger(message.text)
    if (!trigger) {
      return false
    }
    const response: BotResponse = await trigger.respond(message)
    if (response) {
      return await this.sendMessage(response)
    }
  }

  private findTrigger (messageText: string): IResponseTrigger | null {
    for (let trigger of this.responseTriggers) {
      for (let triggerWord of trigger.triggerWords) {
        if (messageText.toLowerCase().includes(triggerWord.toLowerCase())) {
          return trigger
        }
      }
    }

    return null
  }

  private async sendMessage (response: BotResponse): Promise<boolean> {
    let messageRequest: MessageRequest

    if (response.attachments) {
      messageRequest = {
        text: response.responseText,
        attachments: response.attachments,
        bot_id: this.botId,
      }
    } else {
      messageRequest = {
        text: response.responseText,
        bot_id: this.botId,
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