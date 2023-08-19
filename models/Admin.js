const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin'],
        default: 'Admin'
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;

