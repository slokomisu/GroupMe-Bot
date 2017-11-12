import { IBotResponse, IGroupMeMessage } from "../types";
import BasicResponseTrigger from "./BasicResponseTrigger";

export default class LineResponseTrigger extends BasicResponseTrigger {
  constructor() {
    super([/line/i, /lb/i], `IT'S A PROBATIONARY CLASS MATT`)
  }

  public async respond(message: IGroupMeMessage): Promise<IBotResponse> {
    if (message.sender_id === "30714614") {
      const response: IBotResponse = {
        responseText: this.response,
      };
      return response
    } else {
      return undefined;
    }
  }
}
