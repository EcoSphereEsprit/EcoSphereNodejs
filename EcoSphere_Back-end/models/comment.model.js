import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({


    content: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
      },
      user: { 
        type: String,
        required : true
      },
      userId: {
        type: String,
        required : true
      }
});

export default model('Comment', commentSchema);