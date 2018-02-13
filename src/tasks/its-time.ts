import GroupMeBot from '../bot/GroupMeBot';
import { IBotResponse } from '../types';

const bot = new GroupMeBot(process.env.BOT_ID, process.env.ACCESS_TOKEN);

const firstMessage: IBotResponse = {
    responseText: "🔥🥦🔥"
}

const secondMessage: IBotResponse =  {
    responseText: "@gif 420"
};

(async function() {
    await bot.sendMessage(firstMessage);
    await bot.sendMessage(secondMessage);
})()