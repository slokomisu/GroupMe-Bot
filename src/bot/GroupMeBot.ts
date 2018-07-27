import axios from 'axios';
import Raven from '../utils/RavenLogger';
import Message from '../Models/Message';
import BasicResponseTrigger from '../responses/BasicResponseTrigger';
import EverybodyResponseTrigger from '../responses/EverybodyResponseTrigger';
import LineResponseTrigger from '../responses/LineResponseTrigger';
import WeatherResponseTrigger from '../responses/WeatherResponseTrigger';
import {
  IBotResponse,
  IGroupMeMessage,
  IMessageRequest,
  IResponseTrigger,
  SenderType,
} from '../types';
import NoNutNovemberResponseTrigger from '../responses/NoNutNovemberResponseTrigger';
import { GiphyResponseTrigger } from '../responses/GiphyResponseTrigger';
import { RouletteTrigger } from '../responses/RouletteTrigger';
import CernerResponseTrigger from '../responses/funResponses/CernerResponseTrigger'
import ILoveYouResponseTrigger from '../responses/funResponses/ILoveYouResponseTrigger';
import LocationResponseTrigger from '../responses/LocationResponseTrigger';
import DadResponseTrigger from '../responses/funResponses/DadResponseTrigger';

export default class GroupMeBot {
  private botId: string;
  private accessToken: string;
  private responseTriggers: IResponseTrigger[];

  constructor(botId: string, accessToken: string) {
    this.botId = botId;
    this.accessToken = accessToken;
    this.registerResponseTriggers();
  }

  public async processMessage(message: IGroupMeMessage): Promise<IBotResponse> {
    console.log(message);
    if (message.attachments) {
      console.log(message.attachments);
      console.log(message.attachments[0]);
    }

    let response: IBotResponse;

    if (message.sender_type === SenderType.Bot || message.sender_id === '37037125') {
      return undefined;
    }

    const triggers = this.findTriggers(message.text);
    if (!triggers) {
      return undefined;
    }
    let responseSent = false;

    triggers.forEach(async trigger => {
      response = await trigger.respond(message);
      if (response) {
        responseSent = await this.sendMessage(response);
      }
    });

    return undefined;
  }

  private registerResponseTriggers() {
    this.responseTriggers = [
      new EverybodyResponseTrigger(this.accessToken),
      new WeatherResponseTrigger(),
      new LineResponseTrigger(),
      new NoNutNovemberResponseTrigger(),
      new GiphyResponseTrigger(),
      new RouletteTrigger(),
      new CernerResponseTrigger(this.accessToken),
      new ILoveYouResponseTrigger(),
      new BasicResponseTrigger([/absolutely not/i], 'take me to jail'),
      new LocationResponseTrigger(),
      new DadResponseTrigger(),
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

  private findTriggers(messageText: string): IResponseTrigger[] | null {
    const triggers: IResponseTrigger[] = [];
    for (const trigger of this.responseTriggers) {
      if (trigger.isTrigger(messageText)) {
        triggers.push(trigger);
      }
    }

    return triggers.length > 0 ? triggers : null;
  }

  public async sendMessage(response: IBotResponse): Promise<boolean> {
    let messageRequest: IMessageRequest;

    if (response.attachments) {
      messageRequest = {
        attachments: [response.attachments],
        bot_id: this.botId,
        text: response.responseText,
        picture_url: response.picture_url || null,
      };
    } else {
      messageRequest = {
        bot_id: this.botId,
        text: response.responseText,
        picture_url: response.picture_url || null,
      };
    }

    try {
      await axios.post('https://api.groupme.com/v3/bots/post',
        messageRequest);
      console.log(messageRequest);
      return true;
    } catch (e) {
      Raven.captureException(e);
      return false;
    }
  }
}
