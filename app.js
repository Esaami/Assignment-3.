// Assignment 3 - Employee Management API
// Install dependencies with: npm install
// Start with: npm start

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the supplied frontend.
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

app.get('/api/employeelist', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
});

app.get('/api/employeelist/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});

app.post('/api/employeelist', async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    if (!name || !location || !position || salary === undefined || salary === '') {
      return res.status(400).json({ message: 'name, location, position and salary are required' });
    }
    const employee = await Employee.create({ name, location, position, salary: Number(salary) });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create employee', error: error.message });
  }
});

app.delete('/api/employeelist/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
});

app.put('/api/employeelist', async (req, res) => {
  try {
    const { _id, id, name, location, position, salary } = req.body;
    const employeeId = _id || id;
    if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ message: 'A valid _id or id is required in the request body' });
    }
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (position !== undefined) updates.position = position;
    if (salary !== undefined) updates.salary = Number(salary);
    const employee = await Employee.findByIdAndUpdate(employeeId, updates, {
      new: true, runValidators: true
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update employee', error: error.message });
  }
});

// Keep this fallback so the Angular frontend can load its routes.
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'Frontend', 'index.html'), (err) => {
    if (err) next(err);
  });
});

async function start() {
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI. Create a .env file using .env.example.');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

start();
