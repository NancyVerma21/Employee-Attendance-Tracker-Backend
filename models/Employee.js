const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String
  },
  role: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
