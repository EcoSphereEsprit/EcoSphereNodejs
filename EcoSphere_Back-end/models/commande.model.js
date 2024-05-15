import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commandeSchema = new Schema({
    numCommande: {
        type: String,
        required: true,
        unique: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    produits: [{
        idProduit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produit'
        },
        quantite: {
            type: Number,
            required: true
        },
        prixUnitaire: {
            type: Number, 
            required: true
        }
    }],
    infosLivraison: {
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        adresse: {
            type: String,
            required: true
        },
        ville: {
            type: String,
            required: true
        },
        codePostal: {
            type: String,
            required: true
        },
        pays: {
            type: String,
            required: true
        },
        telephone: {
            type: String,
            required: true
        }
    },
    statut: {
        type: String,
        enum: ['en_attente', 'confirmée', 'expédiée', 'livrée'],
        default: 'en_attente'
    },
    statutPaiement: {
        type: String,
        enum: ['en_attente', 'payée', 'remboursée'],
        default: 'en_attente'
    },
    statutLivraison: {
        type: String,
        enum: ['en_attente', 'expédiée', 'livrée'],
        default: 'en_attente'
    },
    prixTotal: {
        type: Number,
        required: true
    },
    modePaiement: {
        type: String,
        enum: ['carte_de_crédit', 'paypal', 'livraison_direct'],
        required: true
    },
    coupon: {
        type: String,
        default: null
    },
    pourcentageRéduction: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 
    },
    dateCommande: {
        type: Date,
        default: Date.now
    }
});
    
export default model('Commandes', commandeSchema);
