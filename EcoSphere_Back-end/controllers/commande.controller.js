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
            pourcentageRéduction,
            historiqueStatuts: [{ date: new Date(), statut: 'en_attente' }]
        });
        const commandeEnregistree = await nouvelleCommande.save();
        res.status(201).json(commandeEnregistree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter un historique de statut
const ajouterHistoriqueStatut = async (commande, newStatuts) => {
    commande.historiqueStatuts.push({
        date: new Date(),
        ...newStatuts
    });
    return commande.save();
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

// Obtenir toutes les commandes avec recherche et filtrage
export const obtenirCommandesFiltre = async (req, res) => {
    try {
        const { statut, userId, dateDebut, dateFin } = req.query;
        const filtre = {};

        if (statut) filtre.statut = statut;
        if (userId) filtre.userId = userId;
        if (dateDebut || dateFin) {
            filtre.dateCommande = {};
            if (dateDebut) filtre.dateCommande.$gte = new Date(dateDebut);
            if (dateFin) filtre.dateCommande.$lte = new Date(dateFin);
        }

        const commandes = await Commande.find(filtre).populate('userId').populate('produits.idProduit');
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

        const commande = await Commande.findById(req.params.id);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        Object.assign(commande, req.body);
        await ajouterHistoriqueStatut(commande, req.body);
        res.status(200).json(await commande.save());
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

// Annuler une commande
export const annulerCommande = async (req, res) => {
    try {
        const commande = await Commande.findById(req.params.id);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (commande.statut === 'expédiée' || commande.statut === 'livrée') {
            return res.status(400).json({ message: "Impossible d'annuler une commande expédiée ou livrée" });
        }

        commande.statut = 'annulée';
        await ajouterHistoriqueStatut(commande, { statut: 'annulée' });

        res.status(200).json(await commande.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
