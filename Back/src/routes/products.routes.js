const Router = require('express')
const router = Router()
const { getOnlyProduct, createProductos, getProducts, updateProducts, deleteProducts } = require('../controllers/products.controllers.js')

//Medotodos del CRUD
router.get('/getProducts', getProducts)
router.post('/createProductos', createProductos)
router.get('/getOnlyProduct/:id_producto', getOnlyProduct)
router.put('/updateProducts/:id_producto', updateProducts) /
  router.delete('/deleteProducts/:id_producto', deleteProducts)

module.exports = router;