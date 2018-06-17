import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../../types'
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

}
