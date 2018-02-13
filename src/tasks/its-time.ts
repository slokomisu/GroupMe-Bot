import GroupMeBot from '../bot/GroupMeBot';
import { IBotResponse } from '../types';





export async function itsTime(bot: GroupMeBot) {
    const firstMessage: IBotResponse = {
        responseText: "🔥🥦🔥"
    }
    
    const secondMessage: IBotResponse =  {
        responseText: "@gif 420"
    };

    await bot.sendMessage(firstMessage)
    await bot.sendMessage(secondMessage)
}