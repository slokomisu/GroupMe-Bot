import { IBotResponse, IGroupMeMessage } from "../types";
import BasicResponseTrigger from "./BasicResponseTrigger";

export default class LineResponseTrigger extends BasicResponseTrigger {
  public respond(message: IGroupMeMessage): Promise<IBotResponse> {
    if (message.sender_id === "30714614") {
      const response: IBotResponse = {
        responseText: this.response,
      };
      return Promise.resolve(response);
    } else {
      return Promise.resolve(undefined);
    }
  }
}
