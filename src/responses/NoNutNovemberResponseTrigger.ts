import axios from 'axios';
import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'

export default class NoNutNovemberResponseTrigger implements IResponseTrigger {
  public triggerWords = ["NUT", "🥜"]
  public async respond(message: IGroupMeMessage): Promise<IBotResponse> {
    let response: IBotResponse;
    const memberRemoved = await this.removeMember(message.id, message.group_id);
    if (memberRemoved) {
      response = {
        responseText: `Removed ${message.name} for violating N🥜N`,
      };
    } else {
      response = {
        responseText: `${message.name} owns this shit, so he can't go.`,
      };
    }
    return Promise.resolve(response);
  }

  private async removeMember(id: string, groupId: string): Promise<boolean> {
    try {
      const response = await axios.post(`https://api.groupme.com/v3/groups/${groupId}/members/${id}/remove?token=${process.env.ACCESS_TOKEN}`);
      if (response.status === 200) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (error) {
      console.error('Remove member error');
      return Promise.resolve(false);
    }
  }


}