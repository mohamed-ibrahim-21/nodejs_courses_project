const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const verifyToken = (req,res,next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        throw appError.create("Token Is Required", 401 , httpStatusText.FAIL);
    }

    const token = authHeader.split(" ")[1];
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }
    catch (error) {
        throw appError.create("Invaled Token", 401 , httpStatusText.FAIL);
    }
}

module.exports = verifyToken;