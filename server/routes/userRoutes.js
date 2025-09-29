import express from 'express'
import { getUserData,getUserJobApplications,applyForJob, updateUserresume } from '../controllers/userController.js';
import upload from '../config/multer.js';


const router = express.Router();

//Get user data
router.get('/user', getUserData);

//Apply for a job
router.post('/apply', applyForJob);

//Get applied job data
router.get('/applications', getUserJobApplications);

//Update user resume
router.post('/update-resume', upload.single('resume'),updateUserresume);

export default router;