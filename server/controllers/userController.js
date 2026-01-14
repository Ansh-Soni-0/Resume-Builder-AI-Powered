const User = require("../models/user")
const bcrypt = require("bcrypt");
const Resume = require("../models/resume");
require("dotenv").config()
const jwt = require("jsonwebtoken")


const generateToken = (userId) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn: '7d'
    })
    return token;
}

//POST : /api/users/register
const registerUser = async (req , res) => {
    try {
        const {name , email , password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message : "missing required fields"})
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({message : "User already exist please login"})
        }

        //create new user
        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = await User.create({
            name , email , password : hashedPassword
        })

        const token = generateToken(newUser._id);

        // console.log(token)

        newUser.password = undefined;

        return res.status(201).json({
            message:"User created successfully",
            token,
            user:newUser
        })


    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

// POST  /api/users/login
const loginUser = async (req , res) => {
    try {
        const {email , password} = req.body;

        //if user exist
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "Invalid email or password"})
        }

        if(!user.comparePassword(password)){
            return res.status(400).json({message : "Invalid email or password"})
        }

        const token = generateToken(user._id)

        console.log(token)

        user.password = undefined

        return res.status(200).json({
            message:"Login successfully",
            token,
            user
        })

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
    
}

//GET: /api/users/data
const getUserById = async (req , res) => { 
    try {
        const userId = req.userId;

        //check if user exist
        const user = await User.findById(userId)
        // console.log(user)
        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        user.password = undefined;

        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}

//controller for getting user resume
//GET: /api/users/resumes
// const getUserResume = async (req , res) => {
//     try {

//         const userId = req.userId;
//         // return user resumes
//         const resumes = await Resume.findById({userId})
        

//         return res.status(200).json({resumes})

//     } catch (error) {
//         return res.status(400).json({ message:error.message })
//     }
// }


//updated code
const getUserResume = async (req , res) => {
    try {

        const userId = req.userId;
        if(!userId){
            return res.status(400).json({ message: 'Missing user id' })
        }

        // return all resumes for the user
        const resumes = await Resume.find({ userId })        

        console.log(resumes)

        return res.status(200).json({ resumes })

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getUserResume
}