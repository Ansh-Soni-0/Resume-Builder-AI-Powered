const imagekit = require("../configs/imagekit");
const Resume = require("../models/resume");
const fs = require("fs")


//POST: /api/resumes/create
const createResume = async (req , res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        // create new resume
        const newResume = await Resume.create({userId , title})

        //return success message
        return res.status(201).json({message:"Resume created successfully" , resume : newResume})

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}

//DELETE: /api/resumes/delete
const deleteResume = async (req , res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId , _id:resumeId});

        //return success message
        return res.status(201).json({message:"Resume deleted successfully"})

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}


//DELETE: /api/resumes/get
const getResumeById = async (req , res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId , _id : resumeId})

        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }

        resume.__v = undefined
        resume.createdAt = undefined
        resume.updatedAt = undefined

        //return success message
        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}

// GET: /api/resumes/public 
const getPublicResumeById = async (req , res) => {
    try {
        const { resumeId } = req.params
        const resume = await Resume.findOne({public: true , _id:resumeId})

        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }

        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({ message:error.message })
    }
}

//POST: /api/resumes/update
const updateResume = async (req , res) => {
    try {
        const userId = req.userId;
        const { resumeId , resumeData , removeBackground } = req.body;

        const image = req.file;

        let resumeDataCopy;

        if(typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData)
        }


        if(image){

            const imageBufferData = fs.createReadStream(image.path)

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder:"user-resumes",

                // fo-face means focus on face 
                transformation:{
                    pre:"w-300,h-300,fo-face,z-0.75" + (removeBackground ?  ',e-bgremove' : '')
                }

            });

            // console.log(response)

            resumeDataCopy.personal_info.image = response.url

        }

        const resume = await Resume.findByIdAndUpdate({ userId, _id:resumeId} , resumeDataCopy , {new : true})


        return res.status(200).json({ message: "Saved successfullu" , resume})

        
    } catch (error) {
        console.error("Error in updateResume:", error);
        return res.status(400).json({ message:error.message })
    }
}



module.exports = {
    createResume,
    deleteResume,
    getResumeById,
    getPublicResumeById,
    updateResume
}