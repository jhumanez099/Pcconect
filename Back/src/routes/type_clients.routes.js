const Router = require('express')
const router = Router()
const { getTypeClients, createTypeClients, getOnlyTypeClients, updateTypeClients, deleteTypeClients } = require('../controllers/type_clients.controllers')

router.get('/getTypeClients', getTypeClients)
router.post('/createTypeClients', createTypeClients)
router.get('/getOnlyTypeClients/:clase_cliente', getOnlyTypeClients)
router.put('/updateTypeClients/:id_tipo_cliente', updateTypeClients)
router.delete('/deleteTypeClients/:id_tipo_cliente', deleteTypeClients)





module.exports = router;