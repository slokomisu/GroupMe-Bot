const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const BOT_ID = '3fb20f85ce19705f0ec1aa1a3a';
const API_URL = 'https://api.groupme.com/v3/bots/post'

app.post('/message', async (req, res) => {
  const { text } = req.body;
  const messageRequest = {
    bot_id: BOT_ID,
    text
  }
  try {
    const request = await axios.post(API_URL, messageRequest);
    const successResponse = {
      message: 'Message succesfully sent',
      text
    }
    res.json(successResponse)
  } catch (error) {
    res.json(error);
  }
});

app.post('/callback', async (req, res) => {
  console.log(req.body);
  const { name, text } = req.body
  const message = `${name} said: ${text}`;
  const messageRequest = {
    bot_id: BOT_ID,
    text: message
  };
  try {
    await axios.post(API_URL, messageRequest);
    console.log('Sent message: ', message);
  } catch (error) {
    console.error('Something went wrong.', error);
  }
})


const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('listening');
})
