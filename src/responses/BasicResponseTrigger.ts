import { BotResponse, GroupMeMessage, IResponseTrigger } from '../types'

export default class BasicResponseTrigger implements IResponseTrigger {
  constructor (public triggerWords: string[], public response: string) {}

  respond (message: GroupMeMessage): Promise<BotResponse> {
    const response: BotResponse = {
      responseText: this.response,
    }
    return Promise.resolve(response)
  }

}