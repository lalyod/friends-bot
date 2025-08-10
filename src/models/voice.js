const { Schema, model } = require('mongoose')

const voiceSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Voice', voiceSchema)