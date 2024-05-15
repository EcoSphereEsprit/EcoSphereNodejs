import express from 'express';
import { body, param } from 'express-validator';
import multer from '../middlewares/multer-config.js';
import { createCommande, getAllCommandes, getCommandeById, updateCommande, deleteCommande, addDetailsCommande, deleteDetailsCommande } from '../controllers/commande.controller.js';

const router = express.Router();

router.route('/')
    .post(
        multer,
        body('numCommande').isLength({ min: 1 }),
        body('produits').isArray(),
        body('infosLivraison').isObject(),
        body('statut').isIn(['en_attente', 'confirmée', 'expédiée', 'livrée']),
        body('prixTotal').isNumeric(),
        body('modePaiement').isIn(['carte_de_crédit', 'paypal', 'livraison_direct']),
        createCommande
    )
    .get(getAllCommandes);

router.route('/:id')
    .get(
        param('id').isMongoId(),
        getCommandeById
    )
    .put(
        param('id').isMongoId(),
        updateCommande
    )
    .delete(
        param('id').isMongoId(),
        deleteCommande
    );

router.route('/:id/details')
    .post(
        param('id').isMongoId(),
        body('commande').isMongoId(),
        body('produit').isMongoId(),
        body('quantite').isInt({ min: 1 }),
        body('prixUnitaire').isNumeric(),
        addDetailsCommande
    );

router.route('/:id/details/:detailsId')
    .delete(
        param('id').isMongoId(),
        param('detailsId').isMongoId(),
        deleteDetailsCommande
    );

export default router;
