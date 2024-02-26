const Router = require('express')
const router = Router()
const { getUsers, createUsers, getOnlyUser, updateUsers, deleteUsers } = require('../controllers/users.controllers.js')

//Medotodos del CRUD
router.get('/getUsers', getUsers)
router.post('/createUsers', createUsers)
router.get('/getOnlyUser/:id_usuario', getOnlyUser)
router.put('/updateUsers/:id_usuario', updateUsers) /
router.delete('/deleteUsers/:id_usuario', deleteUsers)

module.exports = router;