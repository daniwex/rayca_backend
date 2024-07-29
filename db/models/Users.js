const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
    required: [true, "please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "support"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.generateJWT = function () {
  let payload = {
    sub: this._id, 
    role: this.role,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:'30d'});
};
userSchema.methods.validatePassword = async function (inputPassword){
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.models.Users || mongoose.model("Users", userSchema);
module.exports = User;
