import express from 'express';
import { saveProgressionData, getProgressionData } from '../controllers/progressionController'
import { validateRequest } from '../middleware/validateRequest';
import { saveProgressionRequestSchema,getProgressionByUserSchema } from '../schemas/progressionSchema';

const router = express.Router();


router.post('/save', validateRequest(saveProgressionRequestSchema), saveProgressionData);
router.get('/get/:userId',validateRequest(getProgressionByUserSchema), getProgressionData);

export default router;