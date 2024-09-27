const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  subjects: Number,
  sgpa: Number,
  conversionFormula: String,
  percentage: Number,
  marksObtained: Number,
  totalMarks: Number // Add totalMarks to schema
});

const Student = mongoose.model('Student', studentSchema);

// API endpoint to save student data
app.post('/api/students', async (req, res) => {
  const { name, subjects, sgpa, conversionFormula, percentage, marksObtained, totalMarks } = req.body;

  try {
    const newStudent = new Student({
      name,
      subjects,
      sgpa,
      conversionFormula,
      percentage,
      marksObtained,
      totalMarks, // Save totalMarks to MongoDB
    });
    await newStudent.save();
    res.status(201).send('Student data saved');
  } catch (error) {
    res.status(500).send('Error saving student data');
  }
});
app.get("/", (req, res) => {
  res.send("<center> <h1>Backend in working well, for sgpa-calculator. </h1> <br> <h2>Now Start working Frontend <h2><center>");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
