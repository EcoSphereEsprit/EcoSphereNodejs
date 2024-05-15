import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const detailsCommandeSchema = new Schema({
    commande: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commandes',
        required: true
    },
    produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true
    },
    nomProduit: {
        type: String,
        required: true
    }
});

export default model('DetailsCommande', detailsCommandeSchema);
