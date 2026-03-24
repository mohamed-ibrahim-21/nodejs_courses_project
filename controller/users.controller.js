const Users = require('../models/users.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require ('bcrypt');
const generateJwt = require('../utils/generateJWT');

const getAllUsers = asyncWrapper(
    async (req,res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page-1)*limit;
        const users = await Users.find({}, {"__v": false, "password": false}).limit(limit).skip(skip);

        if(users.length === 0){
            throw appError.create("users is empty", 404 , httpStatusText.FAIL);
        }
        res.status(200).json({status : httpStatusText.SUCCESS, data : {users}})
    }
)

const register = asyncWrapper(
    async (req,res) => {
        const {firstName,lastName, email , password , role} = req.body
        const oldUser = await Users.findOne({email : email});
        if(oldUser) {
            throw appError.create("user is already exist", 400 , httpStatusText.FAIL);
        }
        // Make Object from req User
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password,
            role,
            avatar: req.file.filename
        });

        // Password Hashing
        newUser.password = await bcrypt.hash(password, 10);

        // Make Token 
        const token = await generateJwt({email : newUser.email, id : newUser._id, role : newUser.role});
        newUser.token = token;
        
        // Save User In DB
        await newUser.save();

        res.status(201).json({success : httpStatusText.SUCCESS , user : newUser});
    }
)

const login = asyncWrapper(
    async (req, res) => {
        const { email , password } = req.body;

        if(!email || !password){
            throw appError.create("Email , Password Are Required", 400 , httpStatusText.FAIL);
        }

        const user = await Users.findOne({email : email});

        if(!user) {
            throw appError.create("User Not Found", 404 , httpStatusText.FAIL);
        }

        const passwordIsMatch = await bcrypt.compare(password, user.password);
        
        if(passwordIsMatch){
            const token = await generateJwt({email : user.email, id : user._id, role : user.role});
            return res.status(200).json({success : httpStatusText.SUCCESS , user : {token}});
        }
        else {
            throw appError.create("Wrong Password", 400 , httpStatusText.FAIL);
        }
    }
)

module.exports = {
    getAllUsers,
    register,
    login
}