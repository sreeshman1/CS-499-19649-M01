import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  hash: String, // Stores the hashed password
  // salt: String, // bcryptjs incorporates the salt within the hash
});

// Method to set password (hashes and stores it)
UserSchema.methods.setPassword = async function (password) {
  if (!password) throw new Error('Password is required');
  const saltRounds = 10; // Cost factor for hashing
  this.hash = await bcrypt.hash(password, saltRounds);
};

// Method to validate password
UserSchema.methods.validPassword = async function (password) {
  if (!password || !this.hash) return false;
  return bcrypt.compare(password, this.hash);
};

// Method to generate JWT
UserSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Token expires in 7 days

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

export default mongoose.models.User || mongoose.model('User', UserSchema);