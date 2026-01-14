const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        mongoose.connection.on("connected" , () => {console.log("Database connected succssfully")})

        let mongoDBURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if(!mongoDBURI){
            throw new Error("MONGODB_URI environment variable not set")
        }

        //if uri contain '/' at end then remove it
        if(mongoDBURI.endsWith('/')){
            mongoDBURI = mongoDBURI.slice(0 , -1);
        }

        await mongoose.connect(`${mongoDBURI}/${projectName}`)
    } catch (error) {
        console.error("Error connecting to MOngoDB" , error)
    }
}

module.exports = connectDB