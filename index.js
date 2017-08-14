const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const BOT_ID = '59cfea71ee774ff88c74f9593b';
const API_URL = 'https://api.groupme.com/v3'
const GROUP_ID = '32374324'


app.post('/callback', async (req, res) => {
  console.log(req.body);
  const { text, sender_type, group_id } = req.body;
  if (text.includes('@everyone') || text.includes('@everybody')) {
    try {
      const memberList = await getMemberList(group_id);
      await sendMessage(memberList);
      console.log('Tagged everyone')
    } catch (error) {
      console.log(error);
    }
  }
})


async function sendMessage(text) {
  const messageRequest = {
    text,
    bot_id: BOT_ID
  }
  try {
    const request = await axios.post(`https://api.groupme.com/v3/bots/post`, messageRequest);
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
    //  const response = await axios.get(`https://api.groupme.com/v3/groups/32374324?token=m0zkBco61gED00rRPKvaOwTFcYmvL2b8jyeXWUlR`);
     const group = response.data.response;
     const members = group.members;
     const membersList = members.map(member => {
       return member.nickname
     })
     .map(member => {
       return `@${member}`;
     });
     return membersList.join(' ');
   } catch (error) {
     console.log('error', error);
   }

}


const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('listening');
})
