import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    reduction: {
        type: Number,
        required: true,
    },
    dateCreation: {
        type: Date,
        required: true,
    },
    dateExpiration: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
});

export default model('Coupon', couponSchema);
