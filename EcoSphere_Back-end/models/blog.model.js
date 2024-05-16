import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const blogSchema = new Schema({
 
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    image: {
        type: String, 
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required:false
    }
});

export default model('Blog', blogSchema);