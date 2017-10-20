import axios from 'axios';
import { GroupMeMessage, BotResponse, IResponseTrigger, GroupMember } from '../types';


export class EverybodyResponseTrigger implements IResponseTrigger {
  triggerWords = ['@everyone', '@everybody']
  
  constructor(public accessToken: string){}
  

  async respond(message: GroupMeMessage, triggerArgs?: string): Promise<BotResponse> {
    const { mentionList, mentionAttachment } = await this.getMentionList(message);
    const response: BotResponse = {
      responseText: `${message.name} wants your attention! ${mentionList}`,
      attachments: mentionAttachment
    }
    return Promise.resolve(response);
  }

  private async getMentionList(message: GroupMeMessage): Promise<{mentionList: string, mentionAttachment: any}> {
    const {group_id, sender_id, name} = message;
    try {
      const response = await axios.get(`https://api.groupme.com/v3/groups/${group_id}?token=${process.env.ACCESS_TOKEN}`);
      const members = response.data.response.members.filter(member => member.user_id != sender_id);
      const mentionList: string = members.map(member => {
        return `@${member.nickname}`
      }).join(' ');
      const messageOffset = name.length + 23;
      const mentionAttachment = this.buildMentionsAttachment(members, mentionList, messageOffset);
      return {
        mentionList,
        mentionAttachment
      };
    } catch (error) {
      console.error('Get Group Info Error:', error);
    }
  }

  private buildMentionsAttachment(members: GroupMember[], mentionList: string, offset: number): {loci: number[], type: string, user_ids: string[]} {
    const userIds = members.map(member => {
      return member.user_id;
    });
    const loci = []
    members.forEach(member => {
      const startIndex = mentionList.indexOf(member.nickname) + offset;
      const length = member.nickname.length;
      const lociItem = [startIndex, length];
      loci.push(lociItem);
    });
    return {
      loci,
      type: 'mentions',
      user_ids: userIds
    }
  }
  
  
}