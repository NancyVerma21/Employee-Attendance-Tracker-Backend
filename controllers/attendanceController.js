const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Monthly Report JSON (per employee)
const getMonthlyReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const month = req.query.month;

    const start = new Date(`${month}-01`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const records = await Attendance.find({
      employee: employeeId,
      date: { $gte: start, $lt: end }
    });

    const presentDays = records.filter(r => r.checkIn && r.checkOut).length;
    const totalWorkingDays = 22;
    const absentDays = totalWorkingDays - presentDays;
    const percentage = ((presentDays / totalWorkingDays) * 100).toFixed(2);

    res.json({
      employeeId,
      month,
      presentDays,
      absentDays,
      percentage
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate report" });
  }
};

// Monthly Report PDF (per employee)
const exportMonthlyPDF = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const month = req.query.month;

    const start = new Date(`${month}-01`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const records = await Attendance.find({
      employee: employeeId,
      date: { $gte: start, $lt: end }
    });

    const presentDays = records.filter(r => r.checkIn && r.checkOut).length;
    const totalWorkingDays = 22;
    const absentDays = totalWorkingDays - presentDays;
    const percentage = ((presentDays / totalWorkingDays) * 100).toFixed(2);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${month}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Attendance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Month: ${month}`);
    doc.text(`Employee ID: ${employeeId}`);
    doc.text(`Present Days: ${presentDays}`);
    doc.text(`Absent Days: ${absentDays}`);
    doc.text(`Attendance %: ${percentage}%`);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'PDF generation failed' });
  }
};

// Monthly Report Excel (per employee)
const exportMonthlyExcel = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const month = req.query.month;

    const start = new Date(`${month}-01`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const records = await Attendance.find({
      employee: employeeId,
      date: { $gte: start, $lt: end }
    });

    const presentDays = records.filter(r => r.checkIn && r.checkOut).length;
    const totalWorkingDays = 22;
    const absentDays = totalWorkingDays - presentDays;
    const percentage = ((presentDays / totalWorkingDays) * 100).toFixed(2);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance Report');

    sheet.addRow(['Month', 'Employee ID', 'Present Days', 'Absent Days', 'Attendance %']);
    sheet.addRow([month, employeeId, presentDays, absentDays, percentage]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report-${month}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Excel generation failed' });
  }
};

// Monthly Attendance for All Employees (used by AdminPanel)
const getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const employees = await Employee.find();
    const report = [];

    for (const emp of employees) {
      const records = await Attendance.find({
        employee: emp._id,
        $or: [
          {
            date: { $gte: startDate, $lt: endDate }  // if stored as Date
          },
          {
            date: { $regex: `^${year}-${month}` }   // if stored as string "YYYY-MM"
          }
        ]
      });

      let present = 0;
      records.forEach(r => {
        if (r.checkIn && r.checkOut) present++;
      });

      const totalDaysInMonth = new Date(year, parseInt(month), 0).getDate();
      const absent = totalDaysInMonth - present;
      const attendancePercentage = ((present / totalDaysInMonth) * 100).toFixed(2);

      report.push({
        employeeName: emp.name,
        present,
        absent,
        attendancePercentage
      });
    }

    res.json(report);
  } catch (error) {
    console.error("Error in monthly attendance report:", error);
    res.status(500).json({ error: 'Failed to calculate monthly attendance' });
  }
};


module.exports = {
  getMonthlyReport,
  exportMonthlyPDF,
  exportMonthlyExcel,
  getMonthlyAttendance
};
