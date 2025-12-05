import moongoose from 'mongoose';
const Schema = moongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true }
}, { collection: 'students' });

module.exports = moongoose.model('Student', studentSchema);