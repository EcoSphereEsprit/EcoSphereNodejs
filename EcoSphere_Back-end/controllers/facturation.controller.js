// controllers/facturation.controller.js
import Facturation from '../models/Facturation.model.js';
import Commande from '../models/commande.model.js';
import Stripe from 'stripe';

const stripe = new Stripe('votre_cle_secrete_stripe');

// Créer une nouvelle facturation et un paiement via Stripe


// Créer une nouvelle facturation et un paiement via Stripe
export const creerFacturation = async (req, res) => {
    const { commandeId, montantTotal, reductions, taxes, methodePaiement, transactionId } = req.body;

    try {
        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }



        const montantFinal = (montantTotal - reductions + taxes) * 100; 


        let paymentIntent;
        if (methodePaiement === 'carte_de_crédit') {
            paymentIntent = await stripe.paymentIntents.create({
                amount: montantFinal,
                currency: 'eur',
                payment_method_types: ['card'],
                payment_method: 'pm_card_visa',
                confirm: true,

                return_url: 'https://localhost:4000/confirmation' 
            });
        }

        const nouvelleFacturation = new Facturation({
            commandeId,
            montantTotal,
            reductions,
            taxes,
            methodePaiement,

            statutPaiement: methodePaiement === 'carte_de_crédit' ? 'payé' : 'en_attente',
            transactionId: paymentIntent ? paymentIntent.id : null // PaymentIntent ID ou null pour autres méthodes de paiement
        });

        const facturationEnregistree = await nouvelleFacturation.save();


        commande.statutPaiement = methodePaiement === 'carte_de_crédit' ? 'payée' : 'en_attente';
        await commande.save();

        if (res) {
            res.status(201).json(facturationEnregistree);
        } else {
            return facturationEnregistree;
        }
    } catch (error) {
        if (res) {
            res.status(500).json({ message: error.message });
        } else {
            throw new Error(error.message);
        }
    }
};


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