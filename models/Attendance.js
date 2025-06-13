const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
