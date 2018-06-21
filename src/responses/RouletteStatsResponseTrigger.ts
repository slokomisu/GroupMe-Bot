import { BaseTrigger } from "./BaseTrigger";
import { IGroupMeMessage, IBotResponse } from "../types";
import RouletteEvent from "../Models/RouletteEvent";

export default class RouletteStatsResponseTrigger extends BaseTrigger {
    triggerPatterns = [/@roulette:stats/]

    public async respond(message: IGroupMeMessage): Promise<IBotResponse> {
        const memberAttempts = await RouletteEvent.find({userId: message.sender_id});
        const results = memberAttempts.map(attempt => attempt.result);
        const booms = results.filter(result => result === 'BOOM').length;
        const clicks = results.filter(result => result === 'CLICK').length
        const deathAverage = booms / results.length;

        return {
            responseText: `${message.name} dies from the roulette ${deathAverage * 100}% of the time.\nTotal attempts: ${results.length}.\nTotal clicks: ${clicks}.\nTotal deaths: ${booms}`,
        }
    }
}