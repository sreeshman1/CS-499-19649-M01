const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  hash: String,
});

UserSchema.methods.setPassword = async function (password) {
  if (!password) throw new Error('Password is required');
  const saltRounds = 10;
  this.hash = await bcrypt.hash(password, saltRounds);
};

UserSchema.methods.validPassword = async function (password) {
  if (!password || !this.hash) return false;
  return bcrypt.compare(password, this.hash);
};

UserSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET
  );
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
