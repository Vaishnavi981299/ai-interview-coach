const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    type: {type: String, required: true, enum: ['Technical', 'HR', 'System Design', 'Resume']},
    company: {type: String, default: null},
    difficulty: {type: Number, default: 1, min: 1, max: 5},
    messages: [
        {
            role: {type: String, enum: ['ai', 'user']},
            content: {type: String}
        }
    ],
    createdAt: {type: Date, default: Date.now},
    finalScore: { type: Number, default: null }
});
module.exports = mongoose.model('Session', sessionSchema);
