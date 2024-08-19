import express from 'express';
import { getMetadata } from '../controllers/metadataController.js';

const router = express.Router();

router.post('/', getMetadata);

export default router;
