import express from 'express';
import { check } from 'express-validator';
import * as commandeController from '../controllers/commande.controller.js';

const router = express.Router();

// Route pour ajouter une commande
router.post('/ajouter', [
    check('numCommande').notEmpty(),          // Vérifie que le numéro de commande n'est pas vide
    check('produits').notEmpty(),            // Vérifie que la liste des produits n'est pas vide
    check('infosLivraison').notEmpty(),      // Vérifie que les informations de livraison ne sont pas vides
    check('prixTotal').notEmpty(),           // Vérifie que le prix total n'est pas vide
    check('modePaiement').notEmpty(),        // Vérifie que le mode de paiement n'est pas vide
], commandeController.ajouterCommande);

// Route pour obtenir toutes les commandes
router.get('/', commandeController.obtenirCommandes);

// Route pour obtenir une commande par ID
router.get('/:id', commandeController.obtenirCommandeParId);
// Route pour obtenir toutes les commandes avec recherche et filtrage
router.get('/', commandeController.obtenirCommandesFiltre);
// Route pour mettre à jour une commande
router.put('/:id', [
    check('numCommande').notEmpty(),          // Vérifie que le numéro de commande n'est pas vide
    check('produits').notEmpty(),            // Vérifie que la liste des produits n'est pas vide
    check('infosLivraison').notEmpty(),      // Vérifie que les informations de livraison ne sont pas vides
    check('prixTotal').notEmpty(),           // Vérifie que le prix total n'est pas vide
    check('modePaiement').notEmpty(),        // Vérifie que le mode de paiement n'est pas vide
], commandeController.mettreAJourCommande);

// Route pour supprimer une commande
router.delete('/:id', commandeController.supprimerCommande);



// Route pour annuler une commande
router.put('/:id/annuler', commandeController.annulerCommande);
export default router;
