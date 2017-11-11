import { expect } from 'chai'
import GroupMeBot from '../src/bot/GroupMeBot'
import BasicResponseTrigger from '../src/responses/BasicResponseTrigger'
import { IBotResponse, IGroupMeMessage, SenderType } from '../src/types'

describe('GroupMeBot', () => {
  let bot: GroupMeBot
  beforeEach(() => {
    bot = new GroupMeBot('0275dbe87b4d10a2d1cfb66171',
      process.env.ACCESS_TOKEN)
  })

  describe('Response Triggers', () => {

    describe('BasicResponseTrigger', () => {
      let trigger: BasicResponseTrigger
      let message: IGroupMeMessage
      beforeEach(() => {
        message = {
          'attachments': [],
          'avatar_url': 'https://i.groupme.com/123456789',
          'created_at': new Date(1302623328),
          'group_id': '32968213',
          'id': '151028786611978001',
          'name': 'Test Account',
          'sender_id': '51242239',
          'sender_type': SenderType.User,
          'source_guid': 'GUID',
          'text': `Hi dude, how goes it?!`,
          'user_id': '51242239',
        }

        trigger = new BasicResponseTrigger([/hi/i], 'Hello World')
      })

      it('takes an array of patterns and a response as constructor arguments',
        () => {
          expect(trigger.triggerPatterns.length).equal(1)
          expect(trigger.response).to.be.an('string')
        })

      it('Triggers with given pattern', () => {
        const triggerTest = trigger.isTrigger(message.text)
        expect(triggerTest).to.eq(true)
      })

      it('Responds with the given response', async () => {
        let response: IBotResponse = await trigger.respond(message)
        expect(response.responseText).to.eq(trigger.response)
      })

    })
  })

})




