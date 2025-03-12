import { Request, Response } from 'express';
import { saveProgressEntry, fetchProgressionEnteriesByUserId } from '../services/progressionService';


export const saveProgressionData = async (req: Request, res: Response) => {
    const { progression } = req.body;
    try {
        await saveProgressEntry(progression);
        res.status(200).json({ message: 'Progression data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save progression data'  + error});
    }
};

export const getProgressionData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const progression = await fetchProgressionEnteriesByUserId(userId);
        res.status(200).json(progression);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progression data' + error});
    }
};

