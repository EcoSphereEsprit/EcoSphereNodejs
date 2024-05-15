import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    pourcentageRéduction: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    dateExpiration: {
        type: Date,
        required: true
    },
    nombreUtilisations: {
        type: Number,
        default: 0 
    }
});

export default model('Coupon', couponSchema);
