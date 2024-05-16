import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensure category names are unique
    },
    description: {
        type: String,
        required: true
    }
});

export default model('Categories', categoriesSchema);
