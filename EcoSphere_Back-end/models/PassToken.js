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
    }

    next();

});
export default model('PassToken', PassToken);
