// backend/src/controllers/assessment.controller.js
const Assessment = require('../models/Assessment');
const Student = require('../models/Student');

exports.getStudentAssessments = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const currentDate = new Date();

        // Fetch all assessments assigned to the student
        const assessments = await Assessment.find({ assignedTo: student._id });

        // Categorize assessments
        const categorizedAssessments = {
            pending: assessments.filter(a => 
                a.status === 'pending' && new Date(a.dueDate) > currentDate
            ),
            upcoming: assessments.filter(a => 
                a.status === 'upcoming' && new Date(a.dueDate) > currentDate
            ),
            completed: assessments.filter(a => 
                a.status === 'completed' || new Date(a.dueDate) < currentDate
            )
        };

        res.json({
            success: true,
            data: categorizedAssessments
        });

    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessments',
            error: error.message
        });
    }
};

exports.startAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const student = await Student.findOne({ userId: req.user._id });

        const assessment = await Assessment.findOne({
            _id: assessmentId,
            assignedTo: student._id,
            status: 'pending'
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found or not available'
            });
        }

        assessment.status = 'ongoing';
        assessment.startedAt = new Date();
        await assessment.save();

        res.json({
            success: true,
            message: 'Assessment started successfully',
            data: assessment
        });

    } catch (error) {
        console.error('Error starting assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting assessment',
            error: error.message
        });
    }
};