const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const app = express();

app.use(bodyParser.json());

const API_URL = 'https://api.groupme.com/v3'




app.post('/callback', async (req, res) => {
  console.log(req.body);
  const { text, sender_type, group_id } = req.body;
  if (sender_type !== 'bot') {
    if (text.toLowerCase().includes('@everyone') || text.toLowerCase().includes('@everybody')) {
      try {
        const { mentionList, mentionAttachment } = await getMentionList(group_id, text);
        await sendMessage(mentionList, mentionAttachment);
        res.status(200).send();
        console.log('Tagged everyone')
      } catch (error) {
        console.error(error);
        res.status(500);
      }
    } else {
      res.status(200).send();
    }
  }
})


async function sendMessage(text, mentionAttachment) {
  const messageRequest = {
    text,
    attachments: [mentionAttachment],
    bot_id: process.env.BOT_ID
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

function buildMentionsAttachment(members, mentionList) {
  const userIds = members.map(member => {
    return member.user_id;
  });
  const loci = []
  members.forEach(member => {
    const startIndex = mentionList.indexOf(member.nickname);
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

async function getMentionList(groupId, message) {
   try {
     const response = await axios.get(`${API_URL}/groups/${groupId}?token=${process.env.ACCESS_TOKEN}`);
     const members = response.data.response.members;
     const mentionList = members.map(member => {
       return `@${member.nickname}`
     }).join(' ');
     const mentionAttachment = buildMentionsAttachment(members, mentionList);
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
  console.log('listening');
})
