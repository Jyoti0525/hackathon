const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    },
    targetLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: true
    },
    resources: [{
        type: {
            type: String,
            enum: ['course', 'book', 'tutorial', 'project'],
            required: true
        },
        title: String,
        provider: String,
        url: String,
        duration: String,
        difficulty: String
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    completionDate: Date
});

const learningPathSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    targetSkills: [{
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        },
        targetLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
    }],
    milestones: [milestoneSchema],
    startDate: {
        type: Date,
        default: Date.now
    },
    targetCompletionDate: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    preferences: {
        learningStyle: String,
        timeCommitment: String,
        difficulty: String
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

learningPathSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    this._calculateProgress();
    next();
});

learningPathSchema.methods._calculateProgress = function() {
    if (!this.milestones.length) {
        this.progress = 0;
        return;
    }
    
    const completedMilestones = this.milestones.filter(
        milestone => milestone.status === 'completed'
    ).length;
    
    this.progress = (completedMilestones / this.milestones.length) * 100;
};

module.exports = mongoose.model('LearningPath', learningPathSchema);