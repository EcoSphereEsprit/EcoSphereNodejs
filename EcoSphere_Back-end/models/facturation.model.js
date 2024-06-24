import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const facturationSchema = new Schema({
    commandeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commandes', 
        required: true
    },
    montantTotal: {
        type: Number,
        required: true
    },
    reductions: {
        type: Number,
        default: 0
    },
    taxes: {
        type: Number,
        required: true
    },
    dateFacturation: {
        type: Date,
        default: Date.now
    },
    methodePaiement: {
        type: String,
        enum: ['carte_de_crédit', 'paypal', 'livraison'],
        required: true
    },
    statutPaiement: {
        type: String,
        enum: ['en_attente', 'payé', 'remboursé'],
        default: 'en_attente'
    },
    transactionId: {
        type: String,
    }
});

export default model('Facturation', facturationSchema);
