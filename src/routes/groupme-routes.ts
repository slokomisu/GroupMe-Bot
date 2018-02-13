import { Router } from 'express'
import { groupMeCallback, itsTimeCallback} from '../controllers/groupme-controller'

const router: Router = Router()

router.post('/callback', groupMeCallback)
router.get('/itsTime', itsTimeCallback)

export default router