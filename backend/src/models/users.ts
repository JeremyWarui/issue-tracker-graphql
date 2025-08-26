import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  assignedIssues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }]
}, {
  timestamps: true
})

export const User = mongoose.model('User', UserSchema)

