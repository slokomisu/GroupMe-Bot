const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const BOT_ID = '3fb20f85ce19705f0ec1aa1a3a';
const API_URL = 'https://api.groupme.com/v3'
const GROUP_ID = '32374324'


app.post('/callback', async (req, res) => {
  const { text, sender_type } = req.body;
  if (text.includes('@everyone') || text.includes('@everybody')) {
    try {
      const memberList = await getMemberList();
      await sendMessage(memberList);
    } catch (error) {
      console.log(error);
    }
  }
})


async function sendMessage(text) {
  const messageRequest = {
    bot_id: BOT_ID,
    text
  }
  try {
    const request = await axios.post(`${API_URL}/bots/post`, messageRequest);
    const successResponse = {
      message: 'Message succesfully sent',
      text
    }
    console.log(successResponse)
  } catch (error) {
    console.log(error);
  }
}

async function getMemberList(groupId) {
   try {
     const response = await axios.get(`${API_URL}/groups/${groupId}?token=${process.env.ACCESS_TOKEN}`);
     const group = response.data;
     const members = group.members;
     const membersList = members.map(member => {
       return member.nickname
     })
     .map(member => {
       return `@${member}`;
     });
     return membersList.join(' ');
   } catch (error) {
     console.log(error);
   }
}


const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('listening');
})
