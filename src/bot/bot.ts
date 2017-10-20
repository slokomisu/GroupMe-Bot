import axios from 'axios';
import { IResponseTrigger, MessageRequest, GroupMeMessage, SenderType, BotResponse } from '../types';
import { EverybodyResponseTrigger } from '../responses/EverybodyResponseTrigger';




export class GroupMeBot {
  private botId : string;
  private accessToken: string;
  private responseTriggers: IResponseTrigger[];

  constructor(botId: string, accessToken: string) {
    this.botId = botId;
    this.accessToken = accessToken;
    this.responseTriggers = [
      new EverybodyResponseTrigger(this.accessToken),
    ]
  }


  public async processMessage(message: GroupMeMessage): Promise<boolean> {
    if (message.sender_type === SenderType.Bot) {
      return false;
    }

    const trigger = this.findTrigger(message.text)
    if (!trigger) {
      return false;
    }
    const response: BotResponse = await trigger.respond(message);
    const messageSent = await this.sendMessage(response);
    return messageSent;
  }


  private findTrigger(messageText: string): IResponseTrigger | null {
    for (let trigger of this.responseTriggers) {
      for (let triggerWord of trigger.triggerWords) {
        if (messageText.includes(triggerWord)) {
          return trigger;
        }
      }
    }

    return null
  }

  private async sendMessage(response: BotResponse): Promise<boolean> {
    let messageRequest: MessageRequest;

    if (response.attachments) {
      messageRequest = {
        text: response.responseText,
        attachments: response.attachments,
        bot_id: this.botId
      }
    } else {
      messageRequest = {
        text: response.responseText,
        bot_id: this.botId
      }
    }

    try {
      const request = await axios.post('https://api.groupme.com/v3/bots/post', messageRequest);
      console.log(messageRequest);
      return true
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}