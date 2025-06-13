const mongoose = require('mongoose');
const Attendance = require('../models/Attendance'); // adjust path if needed

const MONGODB_URI = 'mongodb://localhost:27017/your-db-name'; // Change DB name

async function fixDateFields() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const result = await Attendance.updateMany(
      { date: { $type: "string" } },
      [
        { $set: { date: { $toDate: "$date" } } }
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('❌ Error fixing date fields:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixDateFields();
