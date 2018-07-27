import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../../types'
import { BaseTrigger } from '../BaseTrigger'

export default class DadResponseTrigger extends BaseTrigger {
  constructor () {
    super()
    this.triggerPatterns = [/i'm/i, /i’m/i, /I’m/, /I'm/]
  }

  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (this.isShitpost(message.group_id)) {

      let splitBase;
      for (let pattern of this.triggerPatterns) {
        if (pattern.test(message.text)) {
          splitBase = message.text.match(pattern);
          break;
        }
      }


      const resp = message.text.split(`${splitBase} `)[1];
      if (resp) {
        return {
          responseText: `Hi ${resp}, I'm Dad.`,
        }
      } else {
        return undefined;
      }

    } else {
      return undefined
    }
  }

}
