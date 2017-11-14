import axios from 'axios'
import { BaseTrigger } from './BaseTrigger'
import { IBotResponse, IGroupMeMessage } from '../types'
import { GroupMeImageService } from '../utils/GroupMeImageService'
import * as util from 'util'

export class GiphyResponseTrigger extends BaseTrigger {
  triggerPatterns = [/@gif/]
  private giphyBaseUrl = 'https://api.giphy.com'

  async respond (message: IGroupMeMessage): Promise<IBotResponse> {
    const searchArgs: string[] = message.text.split(' ').slice(1)
    let gifUrl: string

    // If 1st argument is random, then we get a random gif
    try {
      if (searchArgs[0] === 'random') {
        gifUrl = await this.getRandomGif()
      } else {
        // Otherwise we assume the arguments are search terms so we search those
        // terms and grab the top result
        gifUrl = await this.searchGif(searchArgs)
      }
    } catch (error) {
      console.error('Something went wrong trying to get a GIF from Giphy')
      return undefined
    }
    const getImageServiceURL = util.promisify(
      GroupMeImageService.getImageServiceURL)
    try {
      const url = await getImageServiceURL(gifUrl)
    } catch (error) {
      return {
        responseText: 'GIF TIME',
        picture_url: <string> error.url,
      }
    }
  }

  private async getRandomGif (): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}`)
      return response.data.data.image_original_url
    } catch (error) {
      console.error('Get Gif Data Error', error)
    }

  }

  private async searchGif (searchArgs: string[]): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=${searchArgs.join(
          ' ')}&api_key=${process.env.GIPHY_API_KEY}`)
      return response.data.data[0].images.original.url
    } catch (error) {
      throw new Error('Search GIF Error')
    }
  }

}