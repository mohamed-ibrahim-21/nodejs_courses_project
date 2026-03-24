const {validationResult} = require('express-validator');
const Courses = require('../models/courses.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError')

const getAllCourses = asyncWrapper(
    async (req,res,next)=>{
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const courses = await Courses.find({}, {"__v": false}).limit(limit).skip(skip);
        if(courses.length === 0) {
            const error = appError.create('Courses Is Empty', 404 , httpStatusText.FAIL);
            return next(error);
        }
        res.status(200).json({status: httpStatusText.SUCCESS, data : {courses}}); 
    }
)

const getCourse = asyncWrapper (
    async (req,res,next)=>{
        const singleCourse = await Courses.findById(req.params.courseId)
        if(!singleCourse){
            const error = appError.create('Course Not Found', 404 , httpStatusText.FAIL);
            return next(error);
        }
        return res.status(200).json({status: httpStatusText.SUCCESS, data : {singleCourse}})
    }
)

const addNewCourse = asyncWrapper(
    async (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array(), 400 , httpStatusText.FAIL)
            return next(error);
        }

        const newCourse = new Courses(req.body)
        await newCourse.save();
        res.status(201).json({status: httpStatusText.SUCCESS, data : {NewCourse : newCourse}});
    }
)

const updateCourse = asyncWrapper(
    async (req,res,next)=>{
        const courseId = req.params.courseId;
        const updatedCourse = await Courses.updateOne({_id: courseId}, {$set: req.body})
        if(updatedCourse.matchedCount === 0){
            const error = appError.create("Course Not Found", 404 , httpStatusText.FAIL);
            return next(error);
        }
        res.status(200).json({status: httpStatusText.SUCCESS, data : {UpdatedCourse : updatedCourse}});
    }
)

const deleteCourse = asyncWrapper(
    async (req,res,next)=>{
        const courseId = req.params.courseId;
        const CourseDelete = await Courses.deleteOne({_id: courseId})
        if(CourseDelete.deletedCount === 0){
            const error = appError.create("Course Not Found" , 404 , httpStatusText.FAIL)
            return next(error);
        }
        res.status(200).json({status: httpStatusText.SUCCESS, data : null})
    }
)

module.exports = {
    getAllCourses,
    getCourse,
    addNewCourse,
    updateCourse,
    deleteCourse,
}