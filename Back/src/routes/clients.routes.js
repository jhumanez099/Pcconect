const Router = require('express')
const router = Router()
const { getClients, createClients, getOnlyClients, updateClients } = require('../controllers/clients.controllers.js')

//Medotodos del CRUD
router.get('/getClients', getClients)
router.post('/createClients', createClients)
router.get('/getOnlyClients/:nombre_empresa', getOnlyClients)
router.put('/updateClients/:id_cliente', updateClients)

module.exports = router;