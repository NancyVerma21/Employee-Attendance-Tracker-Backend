const mongoose = require('mongoose');
const Employee = require('./models/Employee');

// Include `employeeId` field for each employee
const employees = [
  {
    name: 'Alice Sharma',
    employeeId: 'EMP001',
    employeeCode: 'HR-001',
    department: 'HR',
    designation: 'HR Manager'
  },
  {
    name: 'Raj Mehta',
    employeeId: 'EMP002',
    employeeCode: 'ENG-002',
    department: 'Engineering',
    designation: 'Software Engineer'
  },
  {
    name: 'Priya Kapoor',
    employeeId: 'EMP003',
    employeeCode: 'FIN-003',
    department: 'Finance',
    designation: 'Accountant'
  },
  {
    name: 'Aman Singh',
    employeeId: 'EMP004',
    employeeCode: 'OPS-004',
    department: 'Operations',
    designation: 'Operations Executive'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/employee-attendance');

    await Employee.deleteMany(); // Clear existing data
    await Employee.insertMany(employees); // Insert sample data
    console.log('✔ Sample Employees Added');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
