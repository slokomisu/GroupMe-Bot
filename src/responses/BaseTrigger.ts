import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'

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

  respond (message: IGroupMeMessage): Promise<IBotResponse> {
    return undefined
  }

}