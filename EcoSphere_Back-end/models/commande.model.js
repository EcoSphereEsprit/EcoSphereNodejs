import mongoose from 'mongoose';

const commandeSchema = new mongoose.Schema({
  numCommande: { type: String, required: true },
  userId :String,
  produits: [{ 
    idProduit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produits', required: true },
    quantite: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true }
  }],
  infosLivraison: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, required: true },
    telephone: { type: String, required: true }
  },
  statutLivraison:{ type: String },
  prixTotal: { type: Number, required: true },
  modePaiement: { type: String, required: true },
  coupon: { type: String },
  pourcentageRéduction: { type: Number },
  historiqueStatuts: [{
    date: { type: Date, required: true },
    statut: { type: String} // Ensure 'statut' is marked as required if needed
  }]
});

const Commande = mongoose.model('Commande', commandeSchema);

export default Commande;
