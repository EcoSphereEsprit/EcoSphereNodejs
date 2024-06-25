import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MFASchema = new Schema({
    code: {
        type: String,
        required: true,
    }
});

export default model('2FACodes', MFASchema);
