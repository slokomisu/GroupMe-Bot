import { BotResponse, GroupMeMessage, IResponseTrigger } from '../types'

export class BasicResponse implements IResponseTrigger {
  constructor (public triggerWords: string[], public response: string) {}

  respond (message: GroupMeMessage): Promise<BotResponse> {
    const response: BotResponse = {
      responseText: this.response,
    }
    return Promise.resolve(response)
  }

}