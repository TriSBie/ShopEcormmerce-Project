
const { mongoose, Schema, Model, Types, model } = require('mongoose'); // Erase if already required

// in mongoDB contains 1 or more collections one collections can contains 1 or more document (key - value) object
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'


// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);