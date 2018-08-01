import { IBotResponse, IGroupMeMessage, IResponseTrigger, TriggerMetadata } from '../types'
import { BaseTrigger } from './BaseTrigger'
import { createClient } from '@google/maps';
import Raven from '../utils/RavenLogger';
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
    const query = message.text.split('@location ')[1];
    let places;
    try {
      places = await this.mapsClient.places({query}).asPromise();
    } catch (error) {
      Raven.captureException(error);
      return {
        responseText: 'Error searching for location.'
      }
    }
    const responses = this.buildResponse(places.json.results.slice(0, 3));
    const responseText = `Found some locations for your search '${query}': \n${responses}`;
    return {
      responseText
    }
  }

  public static getMetadata(): TriggerMetadata {
    return {
      triggerName: 'Location Response',
      triggerDescription: 'Searches for a location and posts the address. Limit of 200 location requests a day' ,
      triggerUseExample: '@location <search terms>',
    }
  }


  private buildResponse(placesResults) {
    const names = placesResults.map(place => place.name);
    const directionURLs = placesResults.map(place => this.generateDirectionsURL(place.place_id));
    const addresses = placesResults.map(place => place.formatted_address);

    const responses = [];
    for (let i = 0; i < names.length; i++) {
      const response = `${i + 1}. ${names[i]} at ${addresses[i]}. Directions: ${directionURLs[i]}`
      responses.push(response);
    }
    return responses.join('\n');
  }

  private generateDirectionsURL(placeId): String {
    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
  }

}
