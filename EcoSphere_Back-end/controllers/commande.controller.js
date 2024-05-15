import Commande from '../models/commande.model.js';
import { validationResult } from 'express-validator';

// Créer une commande
export function createCommande(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const { numCommande, produits, infosLivraison, statut, prixTotal, modePaiement, coupon, pourcentageRéduction } = req.body;

    const newCommande = new Commande({
        numCommande,
        produits,
        infosLivraison,
        statut,
        prixTotal,
        modePaiement,
        coupon,
        pourcentageRéduction
    });

    newCommande.save()
        .then(savedCommande => {
            res.status(201).json(savedCommande);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Récupérer toutes les commandes
export function getAllCommandes(req, res) {
    Commande.find({})
        .then(commandes => {
            res.status(200).json(commandes);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Récupérer une commande par son ID
export function getCommandeById(req, res) {
    Commande.findById(req.params.id)
        .then(commande => {
            if (!commande) {
                return res.status(404).json({ message: "Commande introuvable" });
            }
            res.status(200).json(commande);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Mettre à jour une commande
export function updateCommande(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    Commande.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedCommande => {
            if (!updatedCommande) {
                return res.status(404).json({ message: "Commande introuvable" });
            }
            res.status(200).json(updatedCommande);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Supprimer une commande
export function deleteCommande(req, res) {
    Commande.findByIdAndDelete(req.params.id)
        .then(deletedCommande => {
            if (!deletedCommande) {
                return res.status(404).json({ message: "Commande introuvable" });
            }
            res.status(200).json({ message: "Commande supprimée avec succès" });
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// Ajouter un détail de commande
export function addDetailsCommande(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const { commande, produit, quantite, prixUnitaire } = req.body;

    const newDetailsCommande = new DetailsCommandeModel({
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
    DetailsCommande.findByIdAndDelete(req.params.id)
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
