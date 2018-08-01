import axios from 'axios';
import Raven from '../utils/RavenLogger';
import {
  IBotResponse,
  IGroupMeMessage,
  IMessageRequest,
  IResponseTrigger,
  SenderType,
} from '../types';
import {
  BasicResponseTrigger,
  WeatherResponseTrigger,
  EverybodyResponseTrigger,
  NoNutNovemberResponseTrigger,
  GiphyResponseTrigger,
  RouletteTrigger,
  CernerResponseTrigger,
  ILoveYouResponseTrigger,
  DadResponseTrigger,
  LocationResponseTrigger,
  HelpTrigger
} from '../responses';


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
      new NoNutNovemberResponseTrigger(),
      new GiphyResponseTrigger(),
      new RouletteTrigger(),
      new CernerResponseTrigger(this.accessToken),
      new ILoveYouResponseTrigger(),
      new BasicResponseTrigger([/absolutely not/i], 'take me to jail'),
      new LocationResponseTrigger(),
      new DadResponseTrigger(),
      new HelpTrigger(),
    ];
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
      console.error(e)
      Raven.captureException(e);
      return false;
    }
  }
}
