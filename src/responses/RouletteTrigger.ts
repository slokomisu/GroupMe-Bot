import {BaseTrigger} from './BaseTrigger';
import {IBotResponse, IGroupMeMessage} from '../types';
import NoNutNovemberResponseTrigger from './NoNutNovemberResponseTrigger';

export class RouletteTrigger extends BaseTrigger {

  triggerPatterns = [/@roulette/];

  async respond(message: IGroupMeMessage): Promise<IBotResponse> {
    const roll = getRandomIntInclusive(1, 6)
    if (roll === 6) {
      await NoNutNovemberResponseTrigger.removeMember(message.group_id, message.sender_id);
      return {
        responseText: `🔫BOOM🔫 ${message.name} is dead.`
      }
    } else {
      return {
        responseText: `CLICK. ${message.name} lives another day.`
      }
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}