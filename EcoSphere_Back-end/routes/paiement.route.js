import express from 'express';
import * as paiementController from '../controllers/paiement.controller.js';

const router = express.Router();

// Créer un paiement
router.post('/creer', paiementController.creerPaiement);

// Mettre à jour un paiement
router.put('/:id', paiementController.mettreAJourPaiement);
router.get('/', paiementController.obtenirPaiements);

export default router;
