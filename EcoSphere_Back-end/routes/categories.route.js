import express from 'express';
import { addCategorie , getAllCategories } from '../controllers/categories.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/addCategorie', addCategorie);
router.get('/GetCategories', getAllCategories);


export default router;

