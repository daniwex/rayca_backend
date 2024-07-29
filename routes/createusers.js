const {createUser, deleteUser, updateUser, viewAllUsers} = require('../controllers/user')

const express = require('express')

const createRouter = express.Router()

createRouter.route('/users/create').post(createUser)
createRouter.route('/users/delete/:id').delete(deleteUser)
createRouter.route('/users/update/:id').patch(updateUser)
createRouter.route('/users').get(viewAllUsers)

module.exports = createRouter