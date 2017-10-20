import { Router } from 'express';
import { GroupMeBot } from "../bot/bot";
import { GroupMeMessage } from '../types';

const router: Router = Router();

router.post('/callback', (req, res) => {
  const message: GroupMeMessage = req.body;
  
})

export { router };