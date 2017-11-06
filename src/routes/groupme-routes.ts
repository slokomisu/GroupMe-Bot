import { Router } from 'express'
import callback from '../controllers/groupme-controller'

const router: Router = Router()

router.post('/callback', callback)

export default router