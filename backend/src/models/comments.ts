import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: false // We're handling timestamps manually with strings
})

export const Comment = mongoose.model('Comment', CommentSchema)
