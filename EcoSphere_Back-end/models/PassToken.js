import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

const { Schema, model } = mongoose;
const addOneHour = () => moment.tz('Africa/Tunis').add(1, 'hour').add(20, 'minutes').toDate();
const PassToken = new Schema({
    token: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        required: true,
    },
    validUntill: {
        type: Date,
        default: addOneHour
    },
});

PassToken.pre('save', function(next) {
    const currentTime = addOneHour();
    this.updatedAt = currentTime;

    if (this.isNew) {
        this.createdAt = currentTime;
    }
    next();
});
export default model('PassToken', PassToken);
