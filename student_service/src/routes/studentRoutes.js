const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Student CRUD routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.get('/studentId/:studentId', studentController.getStudentByStudentId);
router.get('/email/:email', studentController.getStudentByEmail);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Course management routes
router.post('/:id/courses', studentController.addCourse);
router.delete('/:id/courses/:courseId', studentController.removeCourse);

// Grade management routes
router.post('/:id/grades', studentController.addGrade);

// Inscription fee management
router.patch('/:id/inscription-fee', studentController.updateInscriptionFeeStatus);

module.exports = router;
