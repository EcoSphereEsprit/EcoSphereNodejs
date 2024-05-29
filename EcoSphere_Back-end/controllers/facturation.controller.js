// controllers/facturation.controller.js
import Facturation from '../models/Facturation.model.js';
import Commande from '../models/commande.model.js';
import Stripe from 'stripe';

const stripe = new Stripe('votre_cle_secrete_stripe');

// Créer une nouvelle facturation et un paiement via Stripe
export const creerFacturation = async (req, res) => {
    const { commandeId, montantTotal, reductions, taxes, methodePaiement, transactionId } = req.body;

    try {
        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        // Calculer le montant total avec réductions et taxes
        const montantFinal = (montantTotal - reductions + taxes) * 100; // Montant en centimes pour Stripe

        // Créer un paiement Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: montantFinal,
            currency: 'eur',
            payment_method: transactionId,
            confirm: true
        });

        const nouvelleFacturation = new FacturationModel({
            commandeId,
            montantTotal,
            reductions,
            taxes,
            methodePaiement,
            statutPaiement: 'payé',
            transactionId: paymentIntent.id
        });

        const facturationEnregistree = await nouvelleFacturation.save();

        // Mettre à jour le statut de paiement de la commande
        commande.statutPaiement = 'payée';
        await commande.save();

        res.status(201).json(facturationEnregistree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les facturations
export const obtenirFacturations = async (req, res) => {
    try {
        const facturations = await Facturation.find().populate('commandeId');
        res.status(200).json(facturations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une facturation par ID
export const obtenirFacturationParId = async (req, res) => {
    const { id } = req.params;

    try {
        const facturation = await Facturation.findById(id).populate('commandeId');
        if (!facturation) {
            return res.status(404).json({ message: "Facturation non trouvée" });
        }
        res.status(200).json(facturation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une facturation
export const mettreAJourFacturation = async (req, res) => {
    const { id } = req.params;
    const { montantTotal, reductions, taxes, methodePaiement, statutPaiement, transactionId } = req.body;

    try {
        const facturation = await Facturation.findById(id);
        if (!facturation) {
            return res.status(404).json({ message: "Facturation non trouvée" });
        }

        facturation.montantTotal = montantTotal ?? facturation.montantTotal;
        facturation.reductions = reductions ?? facturation.reductions;
        facturation.taxes = taxes ?? facturation.taxes;
        facturation.methodePaiement = methodePaiement ?? facturation.methodePaiement;
        facturation.statutPaiement = statutPaiement ?? facturation.statutPaiement;
        facturation.transactionId = transactionId ?? facturation.transactionId;

        const facturationMiseAJour = await facturation.save();
        res.status(200).json(facturationMiseAJour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une facturation
export const supprimerFacturation = async (req, res) => {
    const { id } = req.params;

    try {
        const facturation = await Facturation.findById(id);
        if (!facturation) {
            return res.status(404).json({ message: "Facturation non trouvée" });
        }

        await facturation.remove();
        res.status(200).json({ message: "Facturation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
