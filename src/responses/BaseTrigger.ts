import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../types'

export class BaseTrigger implements IResponseTrigger {
  triggerPatterns: RegExp[]
  allowedGroups: string[]

  constructor () {
    this.allowedGroups = process.env.SHITPOST_GROUPS.split(',')
  }

  isTrigger (message: string): boolean {
    return this.triggerPatterns
      .map(pattern => pattern.test(message))
      .some(result => result === true)
  }

  isShitpost (groupId: string): boolean {
    if (this.allowedGroups.length == 0) {
      return true
    } else {
      return this.allowedGroups.some(group => group === groupId)
    }
  }

  getMetadata(): TriggerMetadata {
    return {
      triggerName: 'BaseTrigger',
      triggerDescription: 'Not intended for use, base trigger',
      triggerUseExample: 'N/A'
    };
  }

  respond (message: IGroupMeMessage): Promise<IBotResponse> {
    return undefined
  }

}
