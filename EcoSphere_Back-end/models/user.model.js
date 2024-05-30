import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        required: true,
        default : false
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

export default model('User', userSchema);
