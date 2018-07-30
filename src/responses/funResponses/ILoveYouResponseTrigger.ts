import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../../types'
import { BaseTrigger } from '../BaseTrigger'

export default class ILoveYouResponseTrigger extends BaseTrigger {
  constructor () {
    super()
    this.triggerPatterns = [/i love you/i]
  }

  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (this.isShitpost(message.group_id)) {
      return {
        responseText: `I love you too ${message.name} 😘`
      }
    } else {
      return undefined
    }
  }

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'Love Response',
      triggerDescription: 'Get some love from the bot',
      triggerUseExample: 'Profess your love to the group',
    }
  }

}
