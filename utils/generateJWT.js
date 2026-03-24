const jwt = require('jsonwebtoken');

module.exports = async (paylode) => {
    const token = await jwt.sign(paylode , process.env.JWT_SECRET_KEY, {expiresIn : '5m'})
    
    return token;
} 