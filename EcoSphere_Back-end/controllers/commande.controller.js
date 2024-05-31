import { validationResult } from 'express-validator';
import Commande from '../models/commande.model.js';

// Ajouter une commande
export const ajouterCommande = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { numCommande, produits, infosLivraison, prixTotal, modePaiement, coupon, pourcentageRéduction } = req.body;
        const userId = req.user.Id;  

        const nouvelleCommande = new Commande({
            numCommande,
            userId,
            produits,
            infosLivraison,
            prixTotal,
            modePaiement,
            coupon,
            pourcentageRéduction
        });
        const commandeEnregistree = await nouvelleCommande.save();
        res.status(201).json(commandeEnregistree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les commandes
export const obtenirCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find().populate('userId').populate('produits.idProduit');
        res.status(200).json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une commande par ID
export const obtenirCommandeParId = async (req, res) => {
    try {
        const commande = await Commande.findById(req.params.id).populate('userId').populate('produits.idProduit');
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }
        res.status(200).json(commande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une commande
export const mettreAJourCommande = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }
        res.status(200).json(commande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une commande
export const supprimerCommande = async (req, res) => {
    try {
        const commande = await Commande.findByIdAndDelete(req.params.id);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }
        res.status(200).json({ message: "Commande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
