const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  student:{type:String,required:true},
  password: { type: String, required: true },
  image: {
    data: Buffer, // binary data
    contentType: String, // e.g., "image/jpeg"
  },
},{
  collection: 'EduBridge_users'
});

module.exports = mongoose.model('User', userSchema);