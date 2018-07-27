import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../../types'
import { BaseTrigger } from '../BaseTrigger'

export default class DadResponseTrigger extends BaseTrigger {
  constructor () {
    super()
    this.triggerPatterns = [/i'm/i]
  }

  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (this.isShitpost(message.group_id)) {
      const resp = message.text.split("I'm ")[1];

      return {
        responseText: `Hi ${message.name}, I'm Dad.`,
      }
    } else {
      return undefined
    }
  }

}
