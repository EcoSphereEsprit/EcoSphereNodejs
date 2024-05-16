import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    quantite_stock: {
        type: Number,
        required: true
    },
    image : {
        type: String,
        required : true,
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    brand : {
        type: String,
        required : false,
    },
    couleur : {
        type: String,
        required : false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    updatedAt: {
        type: Date,
        default: Date.now,
      },
      available: {
        type: Boolean,
        required: true,
      }
});

export default model('Produits', userSchema);
