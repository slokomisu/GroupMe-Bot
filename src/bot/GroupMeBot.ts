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

export default class GroupMeBot {
  private botId: string;
  private accessToken: string;
  private responseTriggers: IResponseTrigger[];

  constructor(botId: string, accessToken: string) {
    this.botId = botId;
    this.accessToken = accessToken;
    this.registerResponseTriggers();
  }

  public async processMessage(message: IGroupMeMessage): Promise<boolean> {
    console.log(message);

    // await this.addMessageToCreepDB(message);
    if (message.sender_type === SenderType.Bot) {
      return false;
    }

    const trigger = this.findTrigger(message.text);
    if (!trigger) {
      return false;
    }
    const response: IBotResponse = await trigger.respond(message);
    if (response) {
      return await this.sendMessage(response);
    }
  }

  private registerResponseTriggers() {
    this.responseTriggers = [
        new EverybodyResponseTrigger(this.accessToken),
        new WeatherResponseTrigger(),
        new LineResponseTrigger(["line", "LB"], "IT'S A PROBATIONARY CLASS MATT"),
      // new BasicResponseTrigger(['NUT', '🥜'], '👀😤😩💦💦👅💯'),
      new NoNutNovemberResponseTrigger(),
        new BasicResponseTrigger(["nani", "何"], "OMAE WA MOU SHINDERU\n\n💥💥💥💥💥💥💥"),
        new BasicResponseTrigger(["PARTY ROCKERS IN THE HOU"], "SE TONIGHT"),
    ];
}

  private async addMessageToCreepDB(message: IGroupMeMessage) {
    await Message.create({
      created_at: new Date(),
      group_id: message.group_id,
      id: message.id,
      name: message.name,
      sender_id: message.sender_id,
      text: message.text,
    });
  }

  private findTrigger(messageText: string): IResponseTrigger | null {
    for (const trigger of this.responseTriggers) {
      for (const triggerWord of trigger.triggerWords) {
        if (messageText.toLowerCase().includes(triggerWord.toLowerCase())) {
          return trigger;
        }
      }
    }

    return null;
  }

  private async removeMember() {}

  private async sendMessage(response: IBotResponse): Promise<boolean> {
    let messageRequest: IMessageRequest;

    if (response.attachments) {
      messageRequest = {
        attachments: response.attachments,
        bot_id: this.botId,
        text: response.responseText,
      };
    } else {
      messageRequest = {
        bot_id: this.botId,
        text: response.responseText,
      };
    }

    try {
      const request = await axios.post("https://api.groupme.com/v3/bots/post",
        messageRequest);
      console.log(messageRequest);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
