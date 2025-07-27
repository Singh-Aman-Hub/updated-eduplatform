const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  student: { type: String, required: true }, // senior or junior
  password: { type: String, required: true },
  image: {
    data: Buffer, // binary data
    contentType: String, // e.g., "image/jpeg"
  },

  // 🔥 Extended profile fields for Seniors
  college: { type: String },            // College Name
  fieldOfStudy: { type: String },       // Senior's field of study
  city:{type:String},
  degree:{type:String},
  goals: { type: String },              // Career/study goals
  currentFee: { type: Number },         // Optional: PGP percentile

  // 🎯 Preferences for Juniors
  preferences: {
    collegeType: { type: String },       // e.g., "Private", "Government", etc.
    fieldInterest: { type: String },     // e.g., "Computer Science", "AI", etc.
    locationPreference: { type: String } // e.g., "Urban", "Rural", etc.
    // Add more if needed later
  }

}, {
  collection: 'EduBridge_users'
});

module.exports = mongoose.model('User', userSchema);