import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title:{
      type: String,
      required: true,
  },
  description:{
    type: String,
    required: true,
    unique : true,
},
tag:{
    type: String,
    default: "General",
},
Date:{
    type: Date,
    default: Date.now,
}

});
module.exports = mongoose.model('notes',NoteSchema);