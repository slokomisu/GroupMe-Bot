import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'

export class BaseTrigger implements IResponseTrigger {
  triggerPatterns: RegExp[]

  isTrigger (message: string): boolean {
    return this.triggerPatterns
      .map(pattern => pattern.test(message))
      .some(result => result === true)
  }

  respond (message: IGroupMeMessage): Promise<IBotResponse> {
    return undefined
  }

}