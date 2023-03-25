const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    preview_url: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
    