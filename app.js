//Librarys 
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const courseRoute = require('./routes/courses.route')
const userRoute = require('./routes/users.route')
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')

//init app
const app = express();

//Connection to Data Base
const url = process.env.MONGO_URL
mongoose.connect(url).then( () => {console.log("Connect To Data Base")})

////Apply Middlewares BodyParser To Can Read Post API
app.use(cors());
app.use(express.json());

//Routers
app.use('/api/courses', courseRoute);
app.use('/api/users', userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Globel Middleware For Not Found Routes
app.use((req,res,next)=> {
    return res.status(404).json({status : httpStatusText.ERROR , data : "This Resource Is Not Available"})
})

//Globel Error Handler
app.use((error, req, res, next)=>{
    return res.status(error.statusCode || 500).json({status : error.statusText || httpStatusText.ERROR , message : error.message})
})

const PORT = process.env.PORT || 5000;
// Listening For Server
app.listen(PORT, () => {console.log('listing to port 5000')})