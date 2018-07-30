import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../types'
import * as responseTriggers from '.'
import { BaseTrigger } from './BaseTrigger'

export default class HelpTrigger extends BaseTrigger {
  triggerPatterns = [/@help/];



  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    const responses = [];
    for (let trigger of Object.values(responseTriggers)) {
        const triggerMetadata = trigger.getMetadata();
        responses.push(`Response: ${triggerMetadata.triggerName}\nDescription: ${triggerMetadata.triggerDescription}\nExample: ${triggerMetadata.triggerUseExample}`);
    }

    return {
        responseText: responses.join('\n\n'),
    }
  }

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'Help Response',
      triggerDescription: 'Lists help information for all responses',
      triggerUseExample: '@help',
    }
  }

}
