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

// Mettre à jour le paiement ( après la livraison)
export const mettreAJourPaiement = async (req, res) => {
    try {
        const { id } = req.params;
        const { montant, dateLivraison, statutLivraison } = req.body;

        const paiement = await Paiement.findById(id);
        if (!paiement) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }

        // Mettre à jour les champs du paiement
        paiement.montant = montant ?? paiement.montant;
        paiement.dateLivraison = dateLivraison ?? paiement.dateLivraison;
        paiement.statutLivraison = statutLivraison ?? paiement.statutLivraison;

        const paiementMiseAJour = await paiement.save();
        res.status(200).json(paiementMiseAJour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


};


export const obtenirPaiements = async (req, res) => {
    try {
        const filter = {};
        if (req.query.statut) {
            filter.statut = req.query.statut;
        }
        if (req.query.statutLivraison) {
            filter.statutLivraison = req.query.statutLivraison;
        }

        const sort = {};
        if (req.query.sortBy) {
            sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.datePaiement = -1;
        }

        const paiements = await Paiement.find(filter)
            .populate({
                path: 'facturationId',
                populate: { path: 'commandeId' } // Populate additional fields in Facturation
            })
            .sort(sort);

        const formattedPaiements = paiements.map(paiement => ({
            _id: paiement._id,
            montant: paiement.montant,
            methode: paiement.methode,
            statut: paiement.statut,
            statutLivraison: paiement.statutLivraison,
            dateLivraison: paiement.dateLivraison,
            infosLivraison: {
                nom: paiement.facturationId.commandeId.infosLivraison.nom,
                prenom: paiement.facturationId.commandeId.infosLivraison.prenom,
                adresse: paiement.facturationId.commandeId.infosLivraison.adresse,
                ville: paiement.facturationId.commandeId.infosLivraison.ville,
                codePostal: paiement.facturationId.commandeId.infosLivraison.codePostal,
                pays: paiement.facturationId.commandeId.infosLivraison.pays,
                telephone: paiement.facturationId.commandeId.infosLivraison.telephone
            },
            statutPaiement: paiement.facturationId.statutPaiement
        }));

        res.status(200).json(formattedPaiements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
