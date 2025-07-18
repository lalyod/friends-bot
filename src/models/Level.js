const { Schema, model } = require('mongoose')

const levelSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0,
    },
    banner_color: {
        type: String,
        default: null
    }
})

module.exports = model('Level', levelSchema)
