import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'

export default class BasicResponseTrigger implements IResponseTrigger {
  constructor (public triggerPatterns: RegExp[], public response: string) {}

  public respond(message: IGroupMeMessage): Promise<IBotResponse> {
    const response: IBotResponse = {
      responseText: this.response,
    };
    return Promise.resolve(response);
  }

}
