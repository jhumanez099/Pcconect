const Router = require('express')
const router = Router()
const { getTypeClients, createTypeClients, getOnlyTypeClient, updateTypeClients, deleteTypeClients } = require('../controllers/type_clients.controllers')

//Medotodos del CRUD
router.get('/getTypeClients', getTypeClients)
router.post('/createTypeClients', createTypeClients)
router.get('/getOnlyTypeClients/:clase_cliente', getOnlyTypeClient)
router.put('/updateTypeClients/:id_tipo_cliente', updateTypeClients)/
router.delete('/deleteTypeClients/:id_tipo_cliente', deleteTypeClients)

module.exports = router;