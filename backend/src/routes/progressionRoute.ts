import express from 'express';
import { saveProgressionData, getProgressionData, uploadProgressionPhoto } from '../controllers/progressionController'
import { validateRequest } from '../middleware/validateRequest';
import { saveProgressionRequestSchema, getProgressionByUserSchema } from '../schemas/progressionSchema';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/save', validateRequest(saveProgressionRequestSchema), saveProgressionData);
router.get('/get/:userId', validateRequest(getProgressionByUserSchema), getProgressionData);
router.post('/upload-photo/:userId', upload.single('photo'), uploadProgressionPhoto);

export default router;