const Router = require('express')
const router = Router()
const {getClients} = require('../controllers/clients.controllers.js')

router.get('/getClients', getClients)


module.exports = router;