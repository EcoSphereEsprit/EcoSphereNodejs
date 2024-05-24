import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorieSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    Nbr_produits: {
        type: Number,
        required: true
    }
});

export default model('Categorie', categorieSchema); 
