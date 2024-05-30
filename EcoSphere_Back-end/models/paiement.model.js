import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paiementSchema = new Schema({
    commandeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commandes',
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
        enum: ['carte_de_crédit', 'paypal', 'autre'],
        required: true
    },
    statut: {
        type: String,
        enum: ['en_attente', 'completé', 'échoué', 'remboursé'],
        default: 'en_attente'
    },
    transactionId: {
        type: String,
        required: true
    },
    datePaiement: {
        type: Date,
        default: Date.now
    }
});

export default model('Paiement', paiementSchema);
