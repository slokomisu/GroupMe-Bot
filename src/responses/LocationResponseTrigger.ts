import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import { BaseTrigger } from './BaseTrigger'
import { createClient } from '@google/maps';
import Raven from '../utils/RavenLogger';
import MapsRequest from '../Models/MapsRequest';
import moment from 'moment';

export default class BasicResponseTrigger extends BaseTrigger {
  private mapsClient;

  constructor () {
    super()
    this.triggerPatterns = [/@location/]
    this.mapsClient = createClient({
      key: process.env.GOOGLE_MAPS_API_KEY,
      Promise: global.Promise
  })
  }

  public async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    if (!this.withinFreeLimit()) {
        return {
            responseText: 'Cannot make any more Google Maps requests due to free API usage limits'
        }
    }

    const query = message.text.split('@location')[1];

    try {
      const places = await this.mapsClient.places({query}).asPromise();
    } catch (error) {
      Raven.captureException(error);
      return {
        responseText: 'Error searching for location.'
      }
    }

    const response =




    await this.countRequest(message.name);

  }

  private async withinFreeLimit(): Promise<boolean> {
    const today = moment().startOf('day');
    const tomorrow = moment(today).endOf('day');

    const todaysRequests = await MapsRequest.find({
        createdAt: {
            $gte: today.toDate(),
            $lt: tomorrow.toDate(),
        }
    });

    return todaysRequests <= 180;
  }

  private async countRequest(requestor) {
    await MapsRequest.create({
        requestEndpoint: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
        requestor,
        requestDate: new Date(Date.now()),
    })
  }

  private generateDirectionsURL(placeId): String {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`;
  }

}
