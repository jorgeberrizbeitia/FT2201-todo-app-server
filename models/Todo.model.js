const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
  title: String,
  description: String,
  isUrgent: Boolean
}, {
  timestamps: true
})

const TodoModel = model("Todo", todoSchema);

module.exports = TodoModel;