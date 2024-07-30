const authRouter = require('./routes/ticket')
const loginAuthRouter = require('./routes/auth')
const connectMongoose = require('./db/connectDB')
const express = require('express')
const auth = require('./middleware/auth')
const createRouter = require('./routes/createusers')
const isAdmin = require('./middleware/admin')

let PORT = process.env.PORT || 5000;

const app = express()

app.use(express.static('public'))

app.use(express.json())


app.use('/api/tickets/',auth,authRouter)
app.use('/api/',loginAuthRouter)
app.use('/api/',auth,isAdmin,createRouter)

app.listen(PORT, () => {
     connectMongoose()
})

 