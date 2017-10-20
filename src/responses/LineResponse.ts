import { BasicResponse } from './BasicResponse'
import { BotResponse, GroupMeMessage } from '../types'

export class LineResponse extends BasicResponse {
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