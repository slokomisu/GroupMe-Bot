import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import { BaseTrigger } from './BaseTrigger'

export default class BasicResponseTrigger extends BaseTrigger {
  constructor (public triggerPatterns: RegExp[], public response: string) {
    super()
  }

  public respond(message: IGroupMeMessage): Promise<IBotResponse> {
    const response: IBotResponse = {
      responseText: this.response,
    };
    return Promise.resolve(response);
  }

}
