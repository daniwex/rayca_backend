const {model, models, Schema} = require('mongoose')


const ticketSchema = new Schema({
    status:{
        type:String,
        required:true
    },
    title: {
         type: String, 
         required: true
    },
    body:{
        type:String,
    },
    created_by:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user'],
    },
    assignedTo: { 
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
}, {timestamps: true})

const ticket = models.ticket || model("ticket", ticketSchema)
module.exports = ticket