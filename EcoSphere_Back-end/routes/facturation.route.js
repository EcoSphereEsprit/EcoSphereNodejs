import express from 'express';
import * as facturationController from '../controllers/facturation.controller.js';

const router = express.Router();

// Route pour créer une facturation
router.post('/creer', facturationController.creerFacturation);

// Route pour obtenir toutes les facturations
router.get('/', facturationController.obtenirFacturations);

// Route pour obtenir une facturation par ID
router.get('/:id', facturationController.obtenirFacturationParId);

// Route pour mettre à jour une facturation
router.put('/:id', facturationController.mettreAJourFacturation);

// Route pour supprimer une facturation
router.delete('/:id', facturationController.supprimerFacturation);

export default router;
