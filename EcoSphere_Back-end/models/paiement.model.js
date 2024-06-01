import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paiementSchema = new Schema({
    facturationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facturation',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    methode: {
        type: String,
        enum: ['carte_de_crédit', 'paypal', 'livraison'],
        required: true
    },
   
    dateLivraison: {
        type: Date
    },
    statutLivraison: {
        type: String,
        enum: ['en_attente', 'livré', 'annulé'],
        default: 'en_attente'
    }
});

export default model('Paiement', paiementSchema);
