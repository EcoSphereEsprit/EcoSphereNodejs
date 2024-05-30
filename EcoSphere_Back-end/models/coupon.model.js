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
    dateExpiration: {
        type: Date,
        required: true,
    }


    //     FlashSale
    // Attributes:
    //         FlashSaleID(Primary Key)
    // Title
    // Description
    // StartTime
    // EndTime
    // Status(e.g., upcoming, active, expired)
    // image_id // 
    // produit_id


});

export default model('Coupon', couponSchema);
