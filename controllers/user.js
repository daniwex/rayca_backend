const User = require("../db/models/Users")


const createUser = async (req, res, next) => {
    const {email, password, role} = await req.body
    if(!email || !password){
        return res.status(400).json({message:"email and password required"})
    }
    const user = await User.create({email, password, role})
    res.status(200).json(user)
    next()
}
const deleteUser = async (req, res, next) => {
    const id = req.params.id
    try{
        const user = await User.findByIdAndDelete({_id:id})
        res.status(200).json({message:`user with ${id} deleted`})
        next()
    }catch(error){
        consosle.log(error)
    }
}
const updateUser = async (req, res, next) => {
    const id = req.params.id
    const {role, email} = req.body
    try{
        if(!role && !email){
            return res.status(400).json({message:"role is required"})
        }
        const user = await User.findByIdAndUpdate({_id:id},{role, email}, ,{new:true, runValidators:true})
        res.status(200).json({user,message:`user with ${id} has been updated`})
        next()
    }catch(error){
        console.log(error)
    }
} 

const viewAllUsers = async ( req, res) => {
    const users = await User.find().select("-password")
    res.status(200).json(users)
}


module.exports = {createUser,deleteUser, updateUser, viewAllUsers} 