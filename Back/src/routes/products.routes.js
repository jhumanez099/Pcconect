const Router = require('express')
const router = Router()
const { getOnlyProduct, createProducts, getProducts, updateProducts, deleteProducts } = require('../controllers/products.controllers.js')

//Medotodos del CRUD
router.get('/getProducts', getProducts)
router.post('/createProducts', createProducts)
router.get('/getOnlyProduct/:id_producto', getOnlyProduct)
router.put('/updateProducts/:id', updateProducts) /
  router.delete('/deleteProducts/:id_producto', deleteProducts)

module.exports = router;