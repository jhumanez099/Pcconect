const Router = require('express')
const router = Router()
const {getClients} = require('../controllers/client.controllers.js')

router.get('/getClients', getClients)


module.exports = router;