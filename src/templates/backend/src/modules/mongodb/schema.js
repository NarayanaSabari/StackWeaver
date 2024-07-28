// models.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Defining schema for User
const UserSchema = new mongoose.Schema({
  username: String, // Name of the user
  email: String, // email of the user
  password: String, // password of the user
});

// Creating UserModel using the UserSchema
const UserModel = mongoose.model('users', UserSchema);

// Exporting UserModel and Carmodel for use in other modules
module.exports = { UserSchema };