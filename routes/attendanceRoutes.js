const express = require('express');
const router = express.Router();

const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const {
  getMonthlyReport,
  exportMonthlyPDF,
  exportMonthlyExcel,
  getMonthlyAttendance
} = require('../controllers/attendanceController');

// Check-in route
router.post('/checkin', async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    let record = await Attendance.findOne({ employee: employeeId, date: today });
    if (!record) {
      record = new Attendance({ employee: employeeId, date: today, checkIn: new Date() });
    } else {
      record.checkIn = new Date();
    }
    await record.save();
    res.status(200).json({ message: 'Check-in recorded', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check-out route
router.post('/checkout', async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    let record = await Attendance.findOne({ employee: employeeId, date: today });
    if (!record) return res.status(400).json({ error: 'Check-in not found.' });

    record.checkOut = new Date();
    await record.save();
    res.status(200).json({ message: 'Check-out recorded', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Today's attendance
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const records = await Attendance.find({ date: today }).populate('employee');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly summary attendance percentage
router.get('/monthly-summary', async (req, res) => {
  try {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    // Format as "YYYY-MM"
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

    const employees = await Employee.find();
    const attendance = await Attendance.find({
      date: { $regex: `^${monthStr}` },  // match "2025-06"
    });

    const result = employees.map((emp) => {
      const empAttendance = attendance.filter(
        (a) => a.employee.toString() === emp._id.toString()
      );

      const presentDays = empAttendance.filter((a) => a.checkIn).length;
      const totalDays = empAttendance.length;
      const absentDays = totalDays - presentDays;

      const percentage =
        totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : '0.00';

      return {
        employeeName: emp.name,
        present: presentDays,
        absent: absentDays,
        attendancePercentage: percentage,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});







// Monthly report export routes
router.get('/report/:employeeId', getMonthlyReport);
router.get('/report/pdf/:employeeId', exportMonthlyPDF);
router.get('/report/excel/:employeeId', exportMonthlyExcel);
router.get('/monthly-report', getMonthlyAttendance);
router.get('/report/monthly/all', getMonthlyAttendance);





module.exports = router;
