import express from 'express';
import upload from '../middlewares/multer-config.js';
import { addProduit ,getProduits,deleteProduit,updateProduit,getProduitById ,getProduitByName} from '../controllers/produits.controller.js';

const router = express.Router();

router.post('/addProduit', upload, addProduit);
router.get('/Getproduits', getProduits);
router.delete('/Produits/:id', deleteProduit);
router.put('/Produits/:id',upload, updateProduit);
router.get('/getProduitById/:id', getProduitById);
router.get('/getProduitByName/search', getProduitByName);






export default router;
