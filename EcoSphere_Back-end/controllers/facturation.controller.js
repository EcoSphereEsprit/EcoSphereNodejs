// controllers/facturation.controller.js
import { validationResult } from 'express-validator';
import FacturationModel from '../models/Facturation.model.js';
import Commande from '../models/commande.model.js';
import Stripe from 'stripe';
import { handleError } from '../utils/errorHandler.js';

const stripe = new Stripe('votre_cle_secrete_stripe');

// Créer une nouvelle facturation et un paiement via Stripe
export const creerFacturation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
        handleError(res, error);
    }
};

// Obtenir toutes les facturations
export const obtenirFacturations = async (req, res) => {
    try {
        const facturations = await Facturation.find().populate('commandeId');
        res.status(200).json(facturations);
    } catch (error) {
        handleError(res, error);
    }