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
  // console.log(req.body.attachments[0].loci);
  const { text, sender_type, group_id } = req.body;
  if (text.includes('@everyone') || text.includes('@everybody')) {
    try {
      const { mentionList, mentionAttachment } = await getMentionList(group_id, text);
      await sendMessage(mentionList, mentionAttachment);
      console.log('Tagged everyone')
    } catch (error) {
      console.log(error);
    }
  }
})


async function sendMessage(text, mentionAttachment) {
  const messageRequest = {
    text,
    attachments: [mentionAttachment],
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
    //  const response = await axios.get(`https://api.groupme.com/v3/groups/32968213?token=m0zkBco61gED00rRPKvaOwTFcYmvL2b8jyeXWUlR`);
     const members = response.data.response.members;
     const mentionList = members.map(member => {
       return member.nickname
     })
     .map(member => {
       return `@${member}`;
     }).join(' ');
     const mentionAttachment = buildMentionsAttachment(members, mentionList);
     return {
       mentionList,
       mentionAttachment
     };
   } catch (error) {
     console.log('error', error);
   }

}


const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('listening');
})
