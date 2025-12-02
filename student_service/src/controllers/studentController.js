const studentService = require('../services/studentService');

/**
 * Student Controller
 * Handles HTTP requests and responses
 */
class StudentController {
    /**
     * GET /api/students
     * Get all students with pagination and filtering
     */
    async getAllStudents(req, res, next) {
        try {
            const { page = 1, limit = 10, inscriptionFeeStatus, enabled, search } = req.query;

            const filters = {};
            if (inscriptionFeeStatus) filters.inscriptionFeeStatus = inscriptionFeeStatus;
            if (enabled !== undefined) filters.enabled = enabled === 'true';
            if (search) filters.search = search;

            const result = await studentService.getAllStudents(
                filters,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: result.students,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/students/:id
     * Get student by ID
     */
    async getStudentById(req, res, next) {
        try {
            const student = await studentService.getStudentById(req.params.id);
            res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/students/studentId/:studentId
     * Get student by student ID
     */
    async getStudentByStudentId(req, res, next) {
        try {
            const student = await studentService.getStudentByStudentId(req.params.studentId);
            res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/students/email/:email
     * Get student by email
     */
    async getStudentByEmail(req, res, next) {
        try {
            const student = await studentService.getStudentByEmail(req.params.email);
            res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/students
     * Create new student
     */
    async createStudent(req, res, next) {
        try {
            const student = await studentService.createStudent(req.body);
            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/students/:id
     * Update student
     */
    async updateStudent(req, res, next) {
        try {
            const student = await studentService.updateStudent(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Student updated successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/students/:id
     * Delete student
     */
    async deleteStudent(req, res, next) {
        try {
            await studentService.deleteStudent(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Student deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/students/:id/courses
     * Add course to student
     */
    async addCourse(req, res, next) {
        try {
            const student = await studentService.addCourse(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Course added successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/students/:id/courses/:courseId
     * Remove course from student
     */
    async removeCourse(req, res, next) {
        try {
            const student = await studentService.removeCourse(req.params.id, req.params.courseId);
            res.status(200).json({
                success: true,
                message: 'Course removed successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/students/:id/grades
     * Add grade to student
     */
    async addGrade(req, res, next) {
        try {
            const student = await studentService.addGrade(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Grade added successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/students/:id/inscription-fee
     * Update inscription fee status
     */
    async updateInscriptionFeeStatus(req, res, next) {
        try {
            const { status } = req.body;
            const student = await studentService.updateInscriptionFeeStatus(req.params.id, status);
            res.status(200).json({
                success: true,
                message: 'Inscription fee status updated successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();
