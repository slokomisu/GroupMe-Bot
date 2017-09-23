const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const humanizeList = require('humanize-list')
const helmet = require('helmet');
const mongoose = require('mongoose');
const Message = require('./Models/Message');




const app = express();
app.use(helmet())
app.use(cors())
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI, () => console.log('connected to mongodb'));
mongoose.Promise = global.Promise
const API_URL = 'https://api.groupme.com/v3'




app.post('/callback', async (req, res) => {
  console.log(req.body);
  const { text, sender_type, group_id, name, sender_id, id, created_at } = req.body;
  await Message.create({text, name, sender_id, id, group_id});
  if (sender_type !== 'bot') {
    if (text.toLowerCase().includes('@everyone') || text.toLowerCase().includes('@everybody')) {
      try {
        const { mentionList, mentionAttachment } = await getMentionList(group_id, text, sender_id, name);
        await sendMessage(name + ' wants your attention! ' + mentionList, mentionAttachment);
        res.status(200).send();
        console.log('Tagged everyone')
      } catch (error) {
        console.error(error);
        res.status(500);
      }
    } else if (text.toLowerCase().includes('@weather')) {
      const city = text.split(' ').slice(1).join(' ');
      if (city === '') {
        return res.status(400).send();
      }
      const weatherMessage = await getWeatherMessage(city);
      await sendMessage(weatherMessage);
      res.status(200).send();
    } else if (sender_id === '30714614' && text.includes('line') || text.includes('LB')) {
      await sendMessage('IT\'S A PROBATIONARY CLASS');
    } else if (text.includes('NUT') || text.includes('nut')) {
      await sendMessage('👀😤😩💦💦👅💯');
    } else {
      res.status(200).send();
    }
  } else {
    res.status(400).send();
  }
})

async function getWeatherMessage(city) {
  const encodedCity = encodeURIComponent(city)
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&APPID=${process.env.WEATHER_API_KEY}`);
    console.log(response.data);
    const message = makeWeatherMessage(response.data);
    return message;
  } catch (error) {
    console.log('Get Weather Data Error', error);
  }
}

function makeWeatherMessage(weather) {
  const tempInFarenheit = Math.floor((weather.main.temp - 273.15) * 9/5 + 32);
  const humidity = weather.main.humidity;
  const descriptions = humanizeList(weather.weather.map(code => code.description), {oxfordComma: true});
  const city = weather.name;
  const country = weather.sys.country;

  const message = `It is ${tempInFarenheit}°F in ${city}, ${country} with a humidity of ${humidity}% with ${descriptions}`;
  return message;
}




async function sendMessage(text, attachments) {
  let messageRequest;
  if (attachments) {
    messageRequest = {
      text,
      attachments: [attachments],
      bot_id: process.env.BOT_ID
    }
  } else {
    messageRequest = {
      text,
      bot_id: process.env.BOT_ID
    }
  }
  try {
    const request = await axios.post(`https://api.groupme.com/v3/bots/post`, messageRequest);
    const successResponse = {
      message: 'Message succesfully sent',
      text
    }
    console.log(successResponse)
  } catch (error) {
    console.error('Message Send Error', error);
  }

}

function buildMentionsAttachment(members, mentionList, offset) {
  const userIds = members.map(member => {
    return member.user_id;
  });
  const loci = []
  members.forEach(member => {
    const startIndex = mentionList.indexOf(member.nickname) + offset;
    const length = member.nickname.length;
    const lociItem = [startIndex, length];
    loci.push(lociItem);
  });
  return {
    loci,
    type: 'mentions',
    user_ids: userIds
  }
}

async function getMentionList(groupId, message, senderId, senderName) {
   try {
     const response = await axios.get(`${API_URL}/groups/${groupId}?token=${process.env.ACCESS_TOKEN}`);
     const members = response.data.response.members.filter(member => member.user_id != senderId);
     const mentionList = members.map(member => {
       return `@${member.nickname}`
     }).join(' ');
     const messageOffset = senderName.length + 23;
     const mentionAttachment = buildMentionsAttachment(members, mentionList, messageOffset);
     return {
       mentionList,
       mentionAttachment
     };
   } catch (error) {
     console.error('Get Group Info Error:', error);
   }

}


const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('listening on ' + port);
})
