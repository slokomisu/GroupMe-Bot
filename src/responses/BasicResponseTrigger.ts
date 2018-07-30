import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../types'
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

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'BaseResponseTrigger',
      triggerDescription: 'Not intended for use, base response trigger',
      triggerUseExample: 'N/A',
    }
  }

}
