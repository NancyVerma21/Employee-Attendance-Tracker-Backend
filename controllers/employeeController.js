const Employee = require('../models/Employee');

// GET /api/employees — get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/employees — create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, employeeId, department } = req.body;

    if (!name || !employeeId || !department) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEmployee = new Employee({ name, employeeId, department });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllEmployees, createEmployee };
