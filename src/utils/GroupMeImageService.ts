import axios from 'axios'
import * as request from 'request'
import * as fs from 'fs'
import * as GroupMe from 'groupme'
import Raven from './RavenLogger';

const ImageService = GroupMe.ImageService

export class GroupMeImageService {
  public static getImageServiceURL (url: string, callback: Function) {
    let stream = request
      .get(url)
      .pipe(fs.createWriteStream('funny_gif.gif'))
      .on('finish', () => {
        ImageService.post(
          'funny_gif.gif', (err, ret) => {
            if (err) Raven.captureException(err);
            callback(ret)
          },
        )
      })

  }

}
