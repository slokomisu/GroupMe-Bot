import { Request, Response } from 'express';
import axios from 'axios';

async function getBots(req: Request, res: Response) {
    const bots = await axios.get(`https://api.groupme.com/v3/bots?token=${process.env.ACCESS_TOKEN}`);
    const response = {
        bots: bots.data.response
    };
    return res.json(response);
}

async function createBot(req: Request, res: Response) {
    const bot = req.body;
    const response = await axios.post(`https://api.groupme.com/v3/bots?token=${process.env.ACCESS_TOKEN}`);
    const createdBot = response.data.response;
    res.json(createdBot);
}

async function destroyBot(req: Request, res: Response) {
    const botId = req.body.botId;
    const response = await axios.delete(`https://api.groupme.com/v3/bots/${botId}?token=${process.env.ACCESS_TOKEN}`);
    if (response.status === 200) {
        res.sendStatus(204);
    }
}
