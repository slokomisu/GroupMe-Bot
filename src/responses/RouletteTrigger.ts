import {BaseTrigger} from './BaseTrigger';
import {IBotResponse, IGroupMeMessage} from '../types';
import NoNutNovemberResponseTrigger from './NoNutNovemberResponseTrigger';
import Member from '../Models/Member'

export class RouletteTrigger extends BaseTrigger {

  triggerPatterns = [/@roulette/];

  async respond(message: IGroupMeMessage): Promise<IBotResponse> {
    const result = this.rollRoulette();
    await this.recordAttempt(result, message.sender_id);
    if (result === 'BOOM') {
      await NoNutNovemberResponseTrigger.removeMember(message.group_id, message.sender_id);
      return {
        responseText: `🔫BOOM🔫 ${message.name} is dead.`
      }
    } else {
      const streak = await this.getStreak(message.sender_id);
      return {
        responseText: `CLICK. ${message.name} lives another day. Streak of ${streak}`
      }
    }
  }

  private async getStreak(userId: string): Promise<Number> {
    const streak = await Member.findOne({'groupmeUserId': userId}, 'rouletteStreak');
    return streak.rouletteStreak;
  }

  private async recordAttempt(result: string, userId: string) {
    const newResult = {
      attemptTime: new Date(Date.now()),
      attemptResult: result,
    };

    let member = await Member.findOne({'groupmeUserId': userId});
    if (!member) {
      member = await Member.create({groupmeUserId: userId, attemptResults: [], rouletteStreak: 0});
    }

    if (result === 'BOOM') {
      member.rouletteStreak = 0;
      member.rouletteResults.push(newResult);
      await member.save();
    } else {
      member.rouletteStreak++;
      member.rouletteResults.push(newResult);
      await member.save();
    }
  }

  private rollRoulette() {
    const roll = getRandomIntInclusive(1, 6);
    return roll === 6 ? 'BOOM' : 'CLICK';
  }
}

function getRandomIntInclusive(min, max): Number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
