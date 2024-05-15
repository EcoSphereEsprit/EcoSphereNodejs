import { validationResult } from 'express-validator';
import DetailsCommande from '../models/DetailsCommande.model.js';

// Ajouter un détail de commande
export function addDetailsCommande(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const { commande, produit, quantite, prixUnitaire } = req.body;

    const newDetailsCommande = new DetailsCommande({
        commande,
        produit,
        quantite,
        prixUnitaire
    });

    newDetailsCommande.save()
        .then(savedDetailsCommande => {
            res.status(201).json(savedDetailsCommande);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Supprimer un détail de commande
export function deleteDetailsCommande(req, res) {
    DetailsCommande.findByIdAndDelete(req.params.detailsId)
        .then(deletedDetailsCommande => {
            if (!deletedDetailsCommande) {
                return res.status(404).json({ message: "Détails de commande introuvables" });
            }
            res.status(200).json({ message: "Détails de commande supprimés avec succès" });
        })
        .catch(err => {
            res.status(500).json(err);
        });


       
    }


    export function getDetailsCommandeById(req, res) {
        const detailsId = req.params.detailsId;
    
        DetailsCommande.findById(detailsId)
            .then(detailsCommande => {
                if (!detailsCommande) {
                    return res.status(404).json({ message: "Détails de commande introuvables" });
                }
                res.status(200).json(detailsCommande);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }