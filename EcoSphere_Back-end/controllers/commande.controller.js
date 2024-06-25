// controllers/commande.controller.js
import { validationResult } from 'express-validator';
import Commande from '../models/commande.model.js';
import { creerFacturation } from './facturation.controller.js';





export const ajouterCommande = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { numCommande, produits, infosLivraison, prixTotal, modePaiement, coupon, pourcentageRéduction } = req.body;

    const nouvelleCommande = new Commande({
      numCommande,
      produits,
      infosLivraison,
      prixTotal,
      modePaiement,
      coupon,
      pourcentageRéduction,
      statutLivraison:'en_attente',
      historiqueStatuts: [{ date: new Date(), statut: 'en_attente' }]
    });

    const commandeEnregistree = await nouvelleCommande.save();
    return res.status(201).json(commandeEnregistree); // Utilisation de return pour arrêter l'exécution
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Utilisation de return pour arrêter l'exécution
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
// Modifier la fonction obtenirCommandes pour gérer à la fois les utilisateurs et les admins
export const obtenirCommandes = async (req, res) => {
  try {
    let commandes;
    if (req.user.role === 'ADMIN') {
      commandes = await Commande.find().populate('userId').populate('produits.idProduit');
    } else {
      commandes = await Commande.find({ userId: req.user._id }).populate('produits.idProduit');
    }
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
       

        const commandes = await Commande.find(filtre).populate('userId').populate('produits.idProduit');
        res.status(200).json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Mettre à jour le statut de paiement d'une commande
export const mettreAJourStatutPaiement = async (req, res) => {
  try {
      const { statutPaiement } = req.body;

      const commande = await Commande.findById(req.params.id);
      if (!commande) {
          return res.status(404).json({ message: "Commande non trouvée" });
      }

      commande.statutPaiement = statutPaiement;
      await ajouterHistoriqueStatut(commande, { statutPaiement });
      
      const commandeMiseAJour = await commande.save();
      res.status(200).json(commandeMiseAJour);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};




// Supprimer une commande en conservant l'historique
export const supprimerCommandeAvecHistorique = async (req, res) => {
  try {
      const commande = await Commande.findById(req.params.id);
      if (!commande) {
          return res.status(404).json({ message: "Commande non trouvée" });
      }

      await commande.remove(); // Supprimer la commande de la base de données


      res.status(200).json({ message: "Commande supprimée avec succès" });
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
  
      // Check if the user has permission to update the command
      if (req.user.role !== 'ADMIN' && commande.userId.toString() !== req.user._id) {
        return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour cette commande" });
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
  
      // Check if the user has permission to delete the command
      if (req.user.role !== 'ADMIN' && commande.userId.toString() !== req.user._id) {
        return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer cette commande" });
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

      // Check if the user has permission to cancel the command
      if (req.user.role !== 'ADMIN' && commande.userId.toString() !== req.user._id) {
          return res.status(403).json({ message: "Vous n'avez pas la permission d'annuler cette commande" });
      }

      if (commande.statutLivraison === 'expédiée' || commande.statutLivraison === 'livrée') {
          return res.status(400).json({ message: "Impossible d'annuler une commande expédiée ou livrée" });
      }

      commande.statutLivraison = 'annulée';
      await commande.save();

      res.status(200).json(commande);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const mettreAJourStatutLivraison = async (req, res) => {
  try {
      console.log('Request body:', req.body); // Log request body

      const { statutLivraison } = req.body;

      // Check if statutLivraison is defined in the request body
      if (!statutLivraison) {
          return res.status(400).json({ message: "Le champ 'statutLivraison' est requis" });
      }

      const commande = await Commande.findById(req.params.id);
      if (!commande) {
          return res.status(404).json({ message: "Commande non trouvée" });
      }

      // Log user and commande details
      console.log('req.user:', req.user);
      console.log('commande:', commande);

 
      // Mettre à jour le statut de livraison directement
      commande.statutLivraison = statutLivraison;
      const commandeMiseAJour = await commande.save();

      res.status(200).json(commandeMiseAJour);
  } catch (error) {
      console.error('Error updating statutLivraison:', error); 
      res.status(500).json({ message: error.message });
  }
};

