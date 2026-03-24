const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

module.exports = (...roles) => {
    return (req,res,next) =>{
        if(!roles.includes(req.currentUser.role)){
            throw appError.create("Not Allowed To This User", 401 , httpStatusText.FAIL);
        }
        else{
            next();
        }
    }
}