import express from 'express';
import * as paiementController from '../controllers/paiement.controller.js';

const router = express.Router();

// Route pour créer un paiement
router.post('/creer', paiementController.createPaiement);

export default router;
