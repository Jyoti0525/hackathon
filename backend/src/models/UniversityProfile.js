const mongoose = require('mongoose');

const universityProfileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    universityName: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        default: ''
    },
    location: { 
        type: String, 
        required: true 
    },
    website: { 
        type: String, 
        required: true 
    },
    contactEmail: { 
        type: String, 
        required: true 
    },
    contactPhone: { 
        type: String, 
        required: true 
    },
    stats: {
        totalStudents: { 
            type: Number, 
            default: 0 
        },
        placedStudents: { 
            type: Number, 
            default: 0 
        },
        averagePackage: { 
            type: Number, 
            default: 0 
        },
        activeCompanies: { 
            type: Number, 
            default: 0 
        },
        placementRate: { 
            type: Number, 
            default: 0 
        }
    },
    departments: [{ 
        type: String 
    }],
    accreditations: [{ 
        type: String 
    }],
    establishedYear: { 
        type: Number 
    },
    logo: {
        type: String,
        default: ''
    },
    socialMedia: {
        linkedin: { 
            type: String, 
            default: '' 
        },
        twitter: { 
            type: String, 
            default: '' 
        },
        facebook: { 
            type: String, 
            default: '' 
        }
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

// Add index for efficient querying
universityProfileSchema.index({ userId: 1 });

// Add a method to calculate profile completion
universityProfileSchema.methods.calculateCompletion = function() {
    const requiredFields = ['universityName', 'location', 'website', 'contactEmail', 'contactPhone'];
    const optionalFields = ['description', 'departments', 'accreditations', 'establishedYear', 'logo'];
    
    let completionScore = 0;
    
    requiredFields.forEach(field => {
        if (this[field]) completionScore += 2;
    });
    
    optionalFields.forEach(field => {
        if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : this[field])) {
            completionScore += 1;
        }
    });
    
    return Math.min((completionScore / (requiredFields.length * 2 + optionalFields.length)) * 100, 100);
};

module.exports = mongoose.model('UniversityProfile', universityProfileSchema);