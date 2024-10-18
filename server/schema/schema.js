const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  prompt: { type: String, required: true },
  generatedMessage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Prompt = mongoose.model("Prompt", promptSchema);

module.exports = Prompt;
