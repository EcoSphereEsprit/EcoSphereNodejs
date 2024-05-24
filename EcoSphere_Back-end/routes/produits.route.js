import express from 'express';


import { addProduit ,getProduits,deleteProduit,updateProduit } from '../controllers/produits.controller.js';

const router = express.Router();

router.post('/addProduit', addProduit);
router.get('/Getproduits', getProduits);
router.delete('/Produits/:id', deleteProduit);
router.put('/Produits/:id', updateProduit);





export default router;
