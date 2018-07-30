import axios from 'axios'
import Raven from '../../utils/RavenLogger';
import {
  IBotResponse,
  IGroupMember,
  IGroupMeMessage,
  TriggerMetadata,
} from '../../types'
import { BaseTrigger } from '../BaseTrigger'

export default class CernerResponseTrigger extends BaseTrigger {
  public triggerPatterns = [/@cerner/]

  constructor (public accessToken: string) {
    super()
  }

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'Cerner Response Trigger',
      triggerDescription: 'Tags everyone who falls in the Cerner Group',
      triggerUseExample: '@cerner',
    }
  }

  public async respond(message: IGroupMeMessage, triggerArgs?: string): Promise<IBotResponse> {
    const { mentionList, mentionAttachment } = await this.getMentionList(message);
    const response: IBotResponse = {
      attachments: mentionAttachment,
      responseText: `${message.name} wants your attention! ${mentionList}`,
    };
    return response
  }

  private async getMentionList(message: IGroupMeMessage): Promise<{mentionList: string, mentionAttachment: any}> {
    const {group_id, sender_id, name} = message;
    const blacklist = process.env.BLACKLIST.split(',')
    try {
      const response =
        await axios.get(`https://api.groupme.com/v3/groups/${group_id}?token=${process.env.ACCESS_TOKEN}`);
      const members = response.data.response.members
        .filter((member) => member.user_id != sender_id)
        .filter(member => blacklist.indexOf(member.user_id) === -1)
      const mentionList: string = members.map((member) => {
        return `@${member.nickname}`;
      }).join(" ");
      const messageOffset = name.length + 23;
      const mentionAttachment = this.buildMentionsAttachment(members, mentionList, messageOffset);
      return {
        mentionAttachment,
        mentionList,
      };
    } catch (error) {
      Raven.captureException(error);
    }
  }

  private buildMentionsAttachment(
    members: IGroupMember[], mentionList: string, offset: number,
  ): {loci: number[], type: string, user_ids: string[]} {
    const userIds = members.map((member) => {
      return member.user_id;
    });
    const loci = [];
    members.forEach((member) => {
      const startIndex = mentionList.indexOf(member.nickname) + offset;
      const length = member.nickname.length
      const lociItem = [startIndex, length];
      loci.push(lociItem);
    });
    return {
      loci,
      type: "mentions",
      user_ids: userIds,
    };
  }

}
