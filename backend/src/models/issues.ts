import mongoose from "mongoose"

const IssuesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5
  },
  description: {
    type: String,
    required: true,
    minLength: 5
  },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, {
  timestamps: false // We're handling timestamps manually with strings
})

// Update the updatedAt field before saving
IssuesSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

export const Issue = mongoose.model('Issue', IssuesSchema)

