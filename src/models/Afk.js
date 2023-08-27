const { model, Schema } = require('mongoose');

const afkSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
    },
    timestamp: {
        type: Number,
    }
})

module.exports = model('Afk', afkSchema)