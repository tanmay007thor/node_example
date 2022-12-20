const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: [true, "please provide name"],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    requried: [true, "please provide email"],
    minlength: 3,
    unique: true,
    maxlength: 50,
    validator(value) {
      if (!isEmail(value)) {
        throw new Error("Email Is Not Valid !");
      }
    },
  },
  password: {
    type: String,
    requried: [true, "please provide name"],
    minlength: 6,
    maxlength: 60,
  },
});
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword , this.password)
    return isMatch
}
module.exports = mongoose.model("User", UserSchema);
