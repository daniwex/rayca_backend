const User = require("../db/models/Users");
const {handleMissingFields} = require('../utils/utils')

const login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return handleMissingFields(res, 400)
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("No user is associated with this account");
  }
  const verifyPassword = await user.validatePassword(password);
  if (!verifyPassword) {
    return res.status(404).send("invalid credentials");
  }
  const token = user.generateJWT();
  res.status(200).json({ user: user.email, token });
};

const register = async (req, res) => {
  const { email, password } = await req.body;
  if(!email || !password){
    return handleMissingFields(res, 400)
  }  const user = await User.create({ email, password });
  const token = user.generateJWT();
  res.status(201).json({ user: user.email, token });
};

module.exports = {
  register, 
  login,
};
 