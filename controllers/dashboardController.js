const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const todayDate = new Date().toISOString().slice(0, 10);

    const presentToday = await Attendance.countDocuments({
      date: todayDate,
      checkIn: { $exists: true },
      checkOut: { $exists: true }
    });

    const absentToday = totalEmployees - presentToday;

    res.json({
      totalEmployees,
      presentToday,
      absentToday
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};

module.exports = {
  getDashboardStats
};
