import { expect } from 'chai'
import GroupMeBot from '../src/bot/GroupMeBot'
import BasicResponseTrigger from '../src/responses/BasicResponseTrigger';
import { IBotResponse, IGroupMeMessage, SenderType } from '../src/types'
import EverybodyResponseTrigger from '../src/responses/EverybodyResponseTrigger'
import LineResponseTrigger from '../src/responses/LineResponseTrigger'
import NoNutNovemberResponseTrigger from '../src/responses/NoNutNovemberResponseTrigger'
import { ProfanityTrigger } from '../src/responses/ProfanityTrigger'
import WeatherResponseTrigger from '../src/responses/WeatherResponseTrigger'

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
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '36300579',
          id: '151028786611978001',
          name: 'Test Account',
          sender_id: '51242239',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: `Hi dude, how goes it?!`,
          user_id: '51242239',
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

    describe('EverybodyResponseTrigger', () => {
      let trigger: EverybodyResponseTrigger;
      let message: IGroupMeMessage;
      beforeEach(() => {
        trigger = new EverybodyResponseTrigger(process.env.ACCESS_TOKEN)
        message = {
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '32968213',
          id: '151028786611978001',
          name: 'Noah Guillory',
          sender_id: '22337091',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: `@everyone`,
          user_id: '22337091',
        }
      })

      it('Triggers on @everyone', () => {
        const triggered = trigger.isTrigger(message.text);
        expect(triggered).to.be.eq(true);
      })

      it('Triggers on @everybody', () => {
        message.text = '@everybody';
        const triggered = trigger.isTrigger(message.text);
        expect(triggered).to.be.eq(true);
      })

      it('Gives a proper response', async () => {
        const expectedResponse = 'Noah Guillory wants your attention! @Test Account @Zo';
        const response = await trigger.respond(message);
        expect(response.responseText).to.eq(expectedResponse);
      })

      it('Mention attachments are valid', async () => {
        const expectedAttachment = {
          loci: [ [ 37, 12 ], [ 51, 2 ] ],
          type: 'mentions',
          user_ids: [ '51242239', '46185459' ]
        }
        const response = await trigger.respond(message);
        expect(response.attachments).to.deep.eq(expectedAttachment);
      })


    })

    describe('LineResponseTrigger', () => {
      let trigger: LineResponseTrigger;
      let message: IGroupMeMessage;
      beforeEach(() => {
        trigger = new LineResponseTrigger();
        message = {
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '32968213',
          id: '151028786611978001',
          name: 'Albus',
          sender_id: '30714614',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: '',
          user_id: '30714614',
        }
      })

      it('Triggers on \'line\'', () => {
        message.text = 'Yall are a line, act like it.';
        const triggered = trigger.isTrigger(message.text);
        expect(triggered).to.be.eq(true);
      })

      it('Triggers on \'LB\'', () => {
        message.text = 'Get your LBs and come over here'
        const triggered = trigger.isTrigger(message.text);
        expect(triggered).to.be.eq(true);
      })

      it('Triggers only for Matt', async () => {
        message.sender_id = '1234575';
        const response = await trigger.respond(message);
        expect(response).to.be.undefined;
      })

      it('Gives the correct response', async () => {
        const response: IBotResponse = await trigger.respond(message);
        expect(response.responseText).to.eql('IT\'S A PROBATIONARY CLASS MATT');
      })

    })

    describe('NoNutNovemberResponseTrigger', () => {
      let trigger: NoNutNovemberResponseTrigger
      let message: IGroupMeMessage
      beforeEach(() => {
        trigger = new NoNutNovemberResponseTrigger()
        message = {
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '32968213',
          id: '151028786611978001',
          name: 'Test Account',
          sender_id: '51242239',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: '',
          user_id: '51242239',
        }
      })

      it('Triggers for \'nut\'', () => {
        message.text = 'nut for days my dudes'
        const triggered = trigger.isTrigger(message.text)
        expect(triggered).to.be.true
      })

      it('Triggers for \'N U T\' ', () => {
        message.text = 'N U T on my honnies'
        const triggered = trigger.isTrigger(message.text)
        expect(triggered).to.be.true
      })

    })

    describe('ProfanityTrigger', () => {
      let trigger: ProfanityTrigger
      let message: IGroupMeMessage
      beforeEach(() => {
        trigger = new ProfanityTrigger()
        message = {
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '32968213',
          id: '151028786611978001',
          name: 'Test Account',
          sender_id: '51242239',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: '',
          user_id: '51242239',
        }
      })

      it('Triggers on \'fuck\' ', () => {
        message.text = 'Oh, would you fuck that for me hon?'
        const triggered = trigger.isTrigger(message.text)
        expect(triggered).to.be.true
      })

    })

    describe('WeatherResponseTrigger', () => {
      let trigger: WeatherResponseTrigger
      let message: IGroupMeMessage
      beforeEach(() => {
        trigger = new WeatherResponseTrigger()
        message = {
          attachments: [],
          avatar_url: 'https://i.groupme.com/123456789',
          created_at: new Date(1302623328),
          group_id: '32968213',
          id: '151028786611978001',
          name: 'Test Account',
          sender_id: '51242239',
          sender_type: SenderType.User,
          source_guid: 'GUID',
          text: '',
          user_id: '51242239',
        }
      })

      it('Gives a no city found response when getting an invalid city',
        async () => {
          message.text = '@weather sdlkfjasndkfjnaskdjfn'
          const response = await trigger.respond(message)
          expect(response.responseText).to.eql('No City Found')
        })

      it('Gives a city response with a valid city', async () => {
        message.text = '@weather Lake Charles'
        const response = await trigger.respond(message)
        expect(response.responseText)
          .to
          .match(
            /It is \d\d°F in Lake Charles, US with a humidity of \d\d% with .*/)
      })

    })

  })

})
