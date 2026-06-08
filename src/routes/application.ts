import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { applicationSchema } from '../vallidator/vallidator.js';
import type { JobApplication } from '../vallidator/vallidator.js';

import { addApplication } from '../controllers/application.controller.js';
const router = express.Router()


router.post('/',validate(applicationSchema),addApplication)

export default router;