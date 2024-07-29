const express = require('express')
const {getAllTickets,createTicket, findTicket, deleteTicket, updateTicket, getTicketsCreated, assignTicket } = require('../controllers/ticket')
const authRouter = express.Router()

authRouter.route('/').post(createTicket).get(getAllTickets)
authRouter.route('/all').get(getTicketsCreated)
authRouter.route('/:id').get(findTicket).delete(deleteTicket).patch(updateTicket)
authRouter.route('/assign/:id').patch(assignTicket)

module.exports = authRouter  