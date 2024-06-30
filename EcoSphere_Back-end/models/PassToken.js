import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

const { Schema, model } = mongoose;

const PassToken = new Schema({
    token: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        currentTime: () => moment.tz('Africa/Tunis').format()
    }
});

export default model('PassToken', PassToken);
