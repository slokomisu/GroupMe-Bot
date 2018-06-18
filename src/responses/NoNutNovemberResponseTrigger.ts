import axios from 'axios'
import Raven from '../utils/RavenLogger';
import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import { BaseTrigger } from './BaseTrigger'

export default class NoNutNovemberResponseTrigger extends BaseTrigger {
  public triggerPatterns = [
    /NUT/i,
    /🥜/,
    /N U T/i,
    /NU T/i,
    /N UT/i,
    /n\.u\.t/i,
    /n,u,t/i,
    /n;u;t/i]


  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (this.isShitpost(message.group_id)) {
      let response: IBotResponse
      if (new Date().getMonth() !== 10) {
        return undefined
      }

      const memberRemoved = await NoNutNovemberResponseTrigger.removeMember(
        message.group_id,
        message.sender_id)
      if (memberRemoved) {
        response = {
          responseText: `Removed ${message.name} for violating N🥜N`,
        }
      } else {
        response = {
          responseText: `${message.name} owns this shit, so he can't go.`,
        }
      }
      return response
    }
  }

  public static async getMemberId (
    groupId: string, senderId: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.groupme.com/v3/groups/${groupId}?token=${process.env.ACCESS_TOKEN}`)
      const members: any[] = response.data.response.members
      return members.find(member => member.user_id === senderId).id
    } catch (error) {
      Raven.captureException(error);
    }
  }

  public static async removeMember (
    groupId: string, senderId: string): Promise<boolean> {
    try {
      const id = await this.getMemberId(groupId, senderId)
      const response = await axios.post(`https://api.groupme.com/v3/groups/${groupId}/members/${id}/remove?token=${process.env.ACCESS_TOKEN}`);
      return response.status === 200
    } catch (error) {
      Raven.captureException(error);
      return false
    }
  }




}
