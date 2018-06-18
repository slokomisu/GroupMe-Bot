import { IBotResponse, IGroupMeMessage, IResponseTrigger } from '../types'
import { BaseTrigger } from './BaseTrigger'
import { createClient } from '@google/maps';
import Raven from '../utils/RavenLogger';
import MapsRequest from '../Models/MapsRequest';
import * as moment from 'moment';

export default class LocationResponseTrigger extends BaseTrigger {
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
    const inFreeLimit = await this.withinFreeLimit();
    if (!inFreeLimit) {
        return {
            responseText: 'Cannot make any more Google Maps requests due to free API usage limits'
        }
    }
    const query = message.text.split('@location ')[1];
    let places;
    try {
      places = await this.mapsClient.places({query}).asPromise();
      await this.countRequest(message.name);
    } catch (error) {
      Raven.captureException(error);
      return {
        responseText: 'Error searching for location.'
      }
    }
    const responses = this.buildResponse(places.json.results);
    const responseText = `Found some locations for your search '${query}': \n${responses}`;
    return {
      responseText
    }
  }

  private async withinFreeLimit(): Promise<boolean> {
    const today = moment().startOf('day');
    const tomorrow = moment(today).endOf('day');

    const todaysRequests = await MapsRequest.find({
        requestDate: {
            $gte: today.toDate(),
            $lt: tomorrow.toDate(),
        }
    });

    return todaysRequests.length <= parseInt(process.env.REQUEST_LIMIT, 10);
  }

  private buildResponse(placesResults) {
    const names = placesResults.map(place => place.name).slice(0, 3);
    const directionURLs = placesResults.map(place => this.generateDirectionsURL(place.place_id)).slice(0, 3);
    const addresses = placesResults.map(place => place.formatted_address).slice(0, 3);

    const responses = [];
    for (let i = 0; i < names.length; i++) {
      const response = `${i + 1}. ${names[i]} at ${addresses[i]}. Directions: ${directionURLs[i]}`
      responses.push(response);
    }
    return responses.join('\n');
  } 

  private async countRequest(requestor) {
    await MapsRequest.create({
        requestEndpoint: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
        requestor,
        requestDate: new Date(Date.now()),
    })
  }

  private generateDirectionsURL(placeId): String {
    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
  }

}
