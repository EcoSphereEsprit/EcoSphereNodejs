import express from 'express';
import { body, param } from 'express-validator';
import { addDetailsCommande, deleteDetailsCommande , getDetailsCommandeById} from '../controllers/detailsCommande.controller.js';

const router = express.Router();

router.route('/')
    .post(
        body('commande').isMongoId(),
        body('produit').isMongoId(),
        body('quantite').isInt({ min: 1 }),
        body('prixUnitaire').isNumeric(),
        addDetailsCommande
    );

router.route('/:detailsId')
    .delete(
        param('detailsId').isMongoId(),
        deleteDetailsCommande
    );

    router.route('/:detailsId')
    .get(
        param('detailsId').isMongoId(),
        getDetailsCommandeById
    )
export default router;
