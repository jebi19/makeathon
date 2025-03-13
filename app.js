// Required Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
// connect to mongodb
mongoose.connect('mongodb://localhost:27017/login')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Define User Model
const User = mongoose.model('User', new mongoose.Schema({
    student_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: String,
    year: Number
}), 'login_details'); // <-- Explicit collection name here

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (e.g., index.html)

// Login Route
// Login Route
app.post('/login', async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    try {
        const user = await User.findOne({ email, password }).lean()

        if (user) {
            res.send(`✅ Welcome, ${user.name}! Login Successful.`);
        } else {
            res.send('❌ Invalid Email or Password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('❌ Server Error');
    }
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
