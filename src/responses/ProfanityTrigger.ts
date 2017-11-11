import * as Filter from 'bad-words'
import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import NoNutNovemberResponseTrigger from './NoNutNovemberResponseTrigger'

const filter = new Filter()

export class ProfanityTrigger implements IResponseTrigger {
  triggerPatterns: RegExp[] = [/.*/]

  async respond (message: IGroupMeMessage): Promise<IBotResponse> {
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