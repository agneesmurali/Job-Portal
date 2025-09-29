import express from 'express';
import { loginCompany, registerCompany,getCompanyData,postJob, getCompanyPostedJobs, changeJobApplicationStatus,changeVisibility,getCompanyJobApplicants } from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

//Register a company
router.post('/register',upload.single('image'), registerCompany);

//Company login
router.post('/login',loginCompany)

//Get company data
router.get('/company',protectCompany, getCompanyData);

//Post a new job
router.post('/post-job', protectCompany,postJob);
//Get Application Data of Company
router.get('/applicants',protectCompany,getCompanyJobApplicants);

//Get Company Job Applications
router.get('/list-jobs',protectCompany,protectCompany,getCompanyPostedJobs);

//Change Application Status
router.post('/change-status',protectCompany,changeJobApplicationStatus)

//Change Application Visibility
router.post('/change-visibility',protectCompany,changeVisibility)
export default router;
