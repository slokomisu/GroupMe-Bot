import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import { BaseTrigger } from './BaseTrigger'

export default class BasicResponseTrigger extends BaseTrigger {
  constructor (public triggerPatterns: RegExp[], public response: string) {
    super()
  }

  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (this.isShitpost(message.group_id)) {
      return {
        responseText: this.response,
      }
    } else {
      return undefined
    }
  }

}
