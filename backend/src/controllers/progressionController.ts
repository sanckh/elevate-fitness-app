import { Request, Response } from 'express';
import { saveProgressEntry, fetchProgressionEnteriesByUserId, uploadProgressionImage } from '../services/progressionService';

export const saveProgressionData = async (req: Request, res: Response): Promise<void> => {
    const { progression } = req.body;
    try {
        await saveProgressEntry(progression);
        res.status(200).json({ message: 'Progression data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save progression data'  + error});
    }
};

export const getProgressionData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const progression = await fetchProgressionEnteriesByUserId(userId);
        res.status(200).json(progression);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progression data' + error});
    }
};

export const uploadProgressionPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const photoIndex = parseInt(req.body.photoIndex, 10);
        const file = req.file;

        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        if (!file.mimetype.startsWith('image/')) {
            res.status(400).json({ error: 'Invalid file type. Please upload an image.' });
            return;
        }

        const photoUrl = await uploadProgressionImage(userId, file, photoIndex);
        res.status(200).json({ photoUrl });
    } catch (error) {
        console.error('Error in uploadProgressionPhoto:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
};
