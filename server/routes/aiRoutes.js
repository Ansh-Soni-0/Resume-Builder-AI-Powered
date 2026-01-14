const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { enhanceProfessinalSummary, enhanceJobDescription, uploadResume } = require("../controllers/aiController");

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum' , protect , enhanceProfessinalSummary);
aiRouter.post('/enhance-job-desc' , protect , enhanceJobDescription);
aiRouter.post('/upload-resume' , protect , uploadResume);

module.exports = aiRouter;