import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { applicationSchema,applicationIdSchema,updateApplicationSchema,paginationSchema} from '../vallidator/vallidator.js';


import { addApplication,getApplications,updateApplication } from '../controllers/application.controller.js';
const router = express.Router()


router.post('/',validate({body:applicationSchema}),addApplication)
router.get('/',validate({query:paginationSchema}),getApplications)
router.put('/:id',validate({params:applicationIdSchema,body:updateApplicationSchema}),updateApplication)
export default router;