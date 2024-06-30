import Paiement from '../models/paiement.model.js';
import stripe from 'stripe';

const stripeAPI = stripe('votre_clé_secrète_stripe');

// Créer un paiement avec Stripe
export const createPaiement = async (req, res) => {
    try {
        const { commandeId, userId, montant, methode, token } = req.body;

        // Création du paiement avec Stripe
        const paiementStripe = await stripeAPI.paymentIntents.create({
            amount: montant * 100, // Le montant doit être en centimes
            currency: 'eur',
            payment_method: token,
            description: `Paiement de la commande ${commandeId}`,
            confirm: true
        });

        // Enregistrement du paiement dans la base de données
        const nouveauPaiement = new Paiement({
            commandeId,
            userId,
            montant,
            methode,
            transactionId: paiementStripe.id // ID de transaction Stripe
        });

        const paiementEnregistre = await nouveauPaiement.save();
        res.status(201).json(paiementEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
