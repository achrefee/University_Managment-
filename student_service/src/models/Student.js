const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
    courseCode: String,
    credits: Number
}, { _id: false });

const gradeSchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
    grade: Number,
    semester: String
}, { _id: false });

const timeTableEntrySchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
    dayOfWeek: String,
    startTime: String,
    endTime: String,
    room: String
}, { _id: false });

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['STUDENT'],
        default: 'STUDENT'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    accountNonExpired: {
        type: Boolean,
        default: true
    },
    accountNonLocked: {
        type: Boolean,
        default: true
    },
    credentialsNonExpired: {
        type: Boolean,
        default: true
    },
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    courses: [courseSchema],
    grades: [gradeSchema],
    timeTable: [timeTableEntrySchema],
    inscriptionFeeStatus: {
        type: String,
        enum: ['PAID', 'NOT_PAID'],
        default: 'NOT_PAID'
    }
}, {
    timestamps: true,
    collection: 'students'
});

// Index for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ studentId: 1 });

module.exports = mongoose.model('Student', studentSchema);
