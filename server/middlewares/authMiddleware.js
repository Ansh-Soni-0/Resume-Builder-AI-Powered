const jwt = require("jsonwebtoken")
require("dotenv").config()
const protect = async (req , res , next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    if(!token){
        return res.status(401).json({ message:"Unauthorized"})
    }

    // console.log(token)

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        // console.log(decoded.userId)

        req.userId = decoded.userId

        next()
    } catch (error) {
        return res.status(401).json({ message:"Unauthorized"})
    }
}

module.exports = protect