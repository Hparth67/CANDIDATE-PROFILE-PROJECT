import express from 'express';
import { health, getProfile, updateProfile, getProjectsBySkill, getTopSkills, searchAll } from '../controllers/profileController.js';

const router = express.Router();

router.get('/health', health);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/projects', getProjectsBySkill);
router.get('/skills/top', getTopSkills);
router.get('/search', searchAll);

export default router;
