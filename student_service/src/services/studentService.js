const Student = require('../models/Student');

/**
 * Student Service Layer
 * Contains business logic for student operations
 */
class StudentService {
    /**
     * Get all students with optional pagination and filtering
     */
    async getAllStudents(filters = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const query = {};

        // Add filters if provided
        if (filters.inscriptionFeeStatus) {
            query.inscriptionFeeStatus = filters.inscriptionFeeStatus;
        }
        if (filters.enabled !== undefined) {
            query.enabled = filters.enabled;
        }
        if (filters.search) {
            query.$or = [
                { firstName: { $regex: filters.search, $options: 'i' } },
                { lastName: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { studentId: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const students = await Student.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Student.countDocuments(query);

        return {
            students,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Get student by ID
     */
    async getStudentById(id) {
        const student = await Student.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }
        return student;
    }

    /**
     * Get student by student ID
     */
    async getStudentByStudentId(studentId) {
        const student = await Student.findOne({ studentId });
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }
        return student;
    }

    /**
     * Get student by email
     */
    async getStudentByEmail(email) {
        const student = await Student.findOne({ email });
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }
        return student;
    }

    /**
     * Create new student
     */
    async createStudent(studentData) {
        // Check if student with email already exists
        const existingStudent = await Student.findOne({ email: studentData.email });
        if (existingStudent) {
            const error = new Error('Student with this email already exists');
            error.statusCode = 400;
            throw error;
        }

        // Check if student ID already exists
        const existingStudentId = await Student.findOne({ studentId: studentData.studentId });
        if (existingStudentId) {
            const error = new Error('Student ID already exists');
            error.statusCode = 400;
            throw error;
        }

        const student = new Student(studentData);
        await student.save();
        return student;
    }

    /**
     * Update student
     */
    async updateStudent(id, updateData) {
        // Don't allow updating certain fields
        delete updateData.password;
        delete updateData.role;
        delete updateData._id;

        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }

        return student;
    }

    /**
     * Delete student
     */
    async deleteStudent(id) {
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }
        return student;
    }

    /**
     * Add course to student
     */
    async addCourse(id, courseData) {
        const student = await Student.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }

        student.courses.push(courseData);
        await student.save();
        return student;
    }

    /**
     * Remove course from student
     */
    async removeCourse(id, courseId) {
        const student = await Student.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }

        student.courses = student.courses.filter(c => c.courseId !== courseId);
        await student.save();
        return student;
    }

    /**
     * Add grade to student
     */
    async addGrade(id, gradeData) {
        const student = await Student.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }

        student.grades.push(gradeData);
        await student.save();
        return student;
    }

    /**
     * Update inscription fee status
     */
    async updateInscriptionFeeStatus(id, status) {
        const student = await Student.findByIdAndUpdate(
            id,
            { inscriptionFeeStatus: status },
            { new: true, runValidators: true }
        );

        if (!student) {
            const error = new Error('Student not found');
            error.statusCode = 404;
            throw error;
        }

        return student;
    }
}

module.exports = new StudentService();
