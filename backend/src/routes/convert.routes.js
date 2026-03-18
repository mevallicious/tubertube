import express from 'express';
import { getInfo } from '../controllers/convert.controller.js';

const router = express.Router();

/**
 * Route: POST /api/v1/convert/info
 * Logic: Validates URL and calls RapidAPI
 */
router.post('/info', getInfo);

export default router;