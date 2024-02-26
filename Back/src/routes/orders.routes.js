const Router = require('express')
const router = Router()
const { getOrders, createOrders, getOnlyOrder, updateOrders, deleteOrders } = require('../controllers/orders.controllers.js')

//Medotodos del CRUD
router.get('/getOrders', getOrders)
router.post('/createOrders', createOrders)
router.get('/getOnlyOrder/:id_pedido', getOnlyOrder)
router.put('/updateOrders/:id_pedido', updateOrders) /
  router.delete('/deleteOrders/:id_pedido', deleteOrders)

module.exports = router;