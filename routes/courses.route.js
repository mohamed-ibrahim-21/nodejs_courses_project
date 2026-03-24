const express = require('express');

const router = express.Router();

// Data File
const coursesController = require('../controller/courses.controller');
const { validationCreateCourse } = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');
const userRole = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

// Get All Courses
// Create a New Course
router.route('/')
        .get (verifyToken, coursesController.getAllCourses)
        .post(verifyToken, validationCreateCourse() ,coursesController.addNewCourse)


// Get Singel Course
// Update Course
// Delete a Course
router.route('/:courseId')
        .get (verifyToken, coursesController.getCourse)
        .patch(verifyToken, coursesController.updateCourse)
        .delete(verifyToken, allowedTo(userRole.ADMIN, userRole.MANGER), coursesController.deleteCourse)

module.exports = router;