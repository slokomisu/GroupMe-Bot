import  BasicResponseTrigger  from './BasicResponseTrigger'
import { BotResponse, GroupMeMessage } from '../types'

export default class LineResponseTrigger extends BasicResponseTrigger {
  respond (message: GroupMeMessage): Promise<BotResponse> {
    if (message.sender_id === '30714614') {
      const response: BotResponse = {
        responseText: this.response,
      }
      return Promise.resolve(response)
    } else {
      return Promise.resolve(undefined)
    }
  }
}