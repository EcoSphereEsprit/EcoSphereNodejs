import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const flashSaleSchema = new Schema({
    product: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    image: {
        type: String
    }
});

export default model('FlashSale', flashSaleSchema);