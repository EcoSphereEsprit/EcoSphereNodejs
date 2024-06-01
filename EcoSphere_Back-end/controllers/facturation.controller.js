import Facturation from '../models/Facturation.model.js';
import Commande from '../models/commande.model.js';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PMo9d02MJa5rkEb3YFBNKFcrS73Kylf2c3ZEidIO6ZPFUlMCijlEbSTmz6vO94DG1AZwj18aXwZo9b7cu1uDgBV00TCbrrLmj');

// Créer une nouvelle facturation et un paiement via Stripe
export const creerFacturation = async (req, res) => {
    const { commandeId, montantTotal, reductions, taxes, methodePaiement } = req.body;

    try {
        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        const montantFinal = (montantTotal - reductions + taxes) * 100; 
//apres cest pris du front-end :
        const paymentIntent = await stripe.paymentIntents.create({
            amount: montantFinal,
            currency: 'eur',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa', 
            confirm: true,
            return_url: 'https://localhost:3000/confirmation' 
        });
        
        const nouvelleFacturation = new Facturation({
            commandeId,
            montantTotal,
            reductions,
            taxes,
            methodePaiement,
            statutPaiement: 'payé',
            transactionId: paymentIntent.id // PaymentIntent ID
        });

        const facturationEnregistree = await nouvelleFacturation.save();

        commande.statutPaiement = 'payée';
        await commande.save();

        res.status(201).json(facturationEnregistree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const obtenirFacturations = async (req, res) => {
    try {
        let query = Facturation.find().populate('commandeId');

        if (req.query.statutPaiement) {
            query = query.where('statutPaiement').equals(req.query.statutPaiement);
        }

        if (req.query.dateFacturation) {
            query = query.where('dateFacturation').equals(req.query.dateFacturation);
        }

        let sort = { montantTotal: 1 };
        if (req.query.sortBy) {
            if (req.query.sortBy === 'montantTotal') {
                sort = { montantTotal: req.query.sortOrder === 'desc' ? -1 : 1 };
            } else if (req.query.sortBy === 'dateFacturation') {
                sort = { dateFacturation: req.query.sortOrder === 'desc' ? -1 : 1 };
            }
        }

        const facturations = await query.sort(sort).exec();
        res.status(200).json(facturations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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

        await facturation.deleteOne();
        res.status(200).json({ message: "Facturation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};