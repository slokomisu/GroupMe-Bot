import * as Filter from 'bad-words'
import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../types'
import NoNutNovemberResponseTrigger from './NoNutNovemberResponseTrigger'
import { BaseTrigger } from './BaseTrigger'

const filter = new Filter()

export default class ProfanityTrigger extends BaseTrigger {
  triggerPatterns: RegExp[] = [/.*/]

  async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (!this.isShitpost(message.group_id)) {
      let response: IBotResponse
      if (filter.isProfane(message.text)) {
        NoNutNovemberResponseTrigger.removeMember(message.group_id,
          message.sender_id)
        response = {
          responseText: `${message.name} needs to chill out for a second`,
        }
      }
      return response
    }
  }

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'Profanity Trigger',
      triggerDescription: 'Removes anyone from the group if they are cursing in my Christian GroupMe server',
      triggerUseExample: 'Say bad words',
    }
  }


}
