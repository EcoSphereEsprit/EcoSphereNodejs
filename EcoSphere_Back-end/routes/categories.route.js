import express from 'express';
import { addCategorie , getAllCategories ,deleteCategorie,updateCategorie} from '../controllers/categories.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/addCategorie', addCategorie);
router.get('/GetCategories', getAllCategories);
router.delete('/Categories/:id', deleteCategorie);
router.put('/Categories/:id', updateCategorie);



export default router;

