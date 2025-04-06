// Required Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

const app = express();

// Global variable to store logged-in user
let loggedInUser = null;

// Connect to MongoDB
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
}), 'login_details');

// Define Grievance Model
const Grievance = mongoose.model('Grievance', new mongoose.Schema({
    grievance_id: { type: String, required: true, unique: true },
    submitter_id: { type: String, required: true },
    submitter_email: { type: String, required: true },
    submitter_category: { type: String, enum: ['student', 'faculty'], required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    communication: { type: [String], required: true },
    evidence: { type: String },
    status: { type: String, default: 'pending' },
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], required: true },
}, { timestamps: true }), 'grievances');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session Middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Multer for file uploads (store files in 'uploads' folder)
const upload = multer({ dest: 'uploads/' });

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password }).lean();

        if (user) {
            req.session.user = user;
            loggedInUser = user;

            if (user.category === 'student' || user.category === 'faculty') {
                return res.redirect('/portal.html');
            }
            else if (user.category === 'worker') {
                switch (user.department.toLowerCase()) {
                    case 'electrical':
                        return res.redirect('/electrical_staff.html');
                    case 'plumbing':
                        return res.redirect('/plumbing_staff.html');
                    case 'carpentry':
                        return res.redirect('/carpentry_staff.html');
                    case 'sanitation':
                        return res.redirect('/sanitation_staff.html');
                    case 'infrastructure':
                        return res.redirect('/maintanence_staff.html');
                    case 'internet':
                        return res.redirect('/technician.html');
                    case 'transport':
                        return res.redirect('/transport_staff.html');
                    case 'food':
                        return res.redirect('/mess_staff.html');
                    case 'safety':
                        return res.redirect('/security_staff.html');
                    default:
                        return res.status(403).send('❌ Unauthorized Department Access');
                }
            } 
            else if (user.category === 'admin') {
                return res.redirect('/admin/admin.html');
            }
            else {
                return res.status(403).send('❌ Unauthorized Access');
            }
        } else {
            return res.status(401).send('❌ Invalid Email or Password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('❌ Server Error');
    }
});
// Fetch Electrical Grievances for Dashboard
app.get('/electrical-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Electrical' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
// Fetch Plumbing Grievances for Dashboard
app.get('/plumbing-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Plumbing' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/carpentry-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Carpentry' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/maintanence-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Infrastructure' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/transport-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Transport' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/safety-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Safety' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/sanitation-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Sanitation' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/food-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Food' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.statusx,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/internet-grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find({ department: 'Internet' }).lean();

        const formattedGrievances = grievances.map(grievance => ({
            id: grievance._id, // MongoDB document ID
            grievance_id: grievance.grievance_id,
            description: grievance.description,
            location: grievance.location,
            status: grievance.status,
            severity: grievance.severity // Include Severity
        }));

        res.json(formattedGrievances);
    } catch (err) {
        console.error('❌ Error fetching electrical grievances:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.put('/api/grievances/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Grievance.findByIdAndUpdate(id, { status: 'completed' });
        res.status(200).json({ message: '✅ Grievance marked as completed' });
    } catch (err) {
        console.error('❌ Error updating grievance:', err);
        res.status(500).send('❌ Server Error');
    }
});
// Fetch electrical grievances summary
app.get('/electrical-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Electrical' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Electrical',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Electrical',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Electrical',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/carpentry-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Carpentry' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Carpentry',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Carpentry',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Carpentry',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/plumbing-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Plumbing' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Plumbing',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Plumbing',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Plumbing',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/maintanence-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Infrastructure' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Infrastructure',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Infrastructure',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Infrastructure',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/transport-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Transport' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Transport',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Transport',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Transport',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/sanitation-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Sanitation' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Sanitation',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Sanitation',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Sanitation',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/food-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Food' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Food',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Food',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Food',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/safety-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Safety' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Safety',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Safety',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Safety',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
app.get('/internet-summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalWorks = await Grievance.countDocuments({ department: 'Internet' });

        const dailyWorks = await Grievance.countDocuments({
            department: 'Internet',
            createdAt: { $gte: today }
        });

        const pendingWorks = await Grievance.countDocuments({
            department: 'Internet',
            status: 'pending'
        });

        const completedWorks = await Grievance.countDocuments({
            department: 'Internet',
            status: 'completed'
        });

        res.json({ totalWorks, dailyWorks, pendingWorks, completedWorks });
    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        res.status(500).send('❌ Server Error');
    }
});
const { v4: uuidv4 } = require('uuid'); // Ensure you install this package using npm install uuid

app.post('/submit-grievance', upload.single('evidence'), async (req, res) => {
    if (!loggedInUser) {
        return res.status(401).send('❌ Unauthorized');
    }

    const { location, description, dateTime, communication, department } = req.body;
    const evidencePath = req.file ? req.file.path : '';

    // Generate a unique grievance ID
    const grievanceId = `GRV-${Date.now()}-${uuidv4().slice(0, 6)}`;

    // Determine severity based on description
    const severity = categorizeIssue(description);

    try {
        const newGrievance = new Grievance({
            grievance_id: grievanceId,
            department,
            location,
            description,
            dateTime: new Date(dateTime),
            communication: Array.isArray(communication) ? communication : [communication],
            evidence: evidencePath,
            status: 'pending',
            severity, // Add severity to grievance
            submitter_id: loggedInUser.student_id || loggedInUser.faculty_id,
            submitter_email: loggedInUser.email,
            submitter_category: loggedInUser.category,
        });

        await newGrievance.save();
        console.log('✅ Grievance Saved:', newGrievance);

        res.redirect('/portal.html');
    } catch (err) {
        console.error('❌ Error Saving Grievance:', err);
        res.status(500).send('❌ Error Submitting Grievance');
    }
});
// Function to classify severity based on keywords
function categorizeIssue(issueText) {
    issueText = issueText.toLowerCase(); // Normalize text

    const criticalKeywords = ["fire", "explosion", "structural damage", "severe", "electrocution", "gas leak", "hazard", "no power", "collapse"];
    if (criticalKeywords.some(word => issueText.includes(word))) {
        return "Critical";
    }

    const highKeywords = ["power outage", "no water", "severe leak", "major fault", "frequent failure", "short circuit", "security breach", "flooding","Unauthorized"];
    if (highKeywords.some(word => issueText.includes(word))) {
        return "High";
    }

    const mediumKeywords = ["flickering", "intermittent", "slow", "minor leak", "temperature fluctuation", "unstable", "clogging", "low pressure"];
    if (mediumKeywords.some(word => issueText.includes(word))) {
        return "Medium";
    }

    const lowKeywords = ["paint peeling", "small crack", "dirt", "stains", "needs cleaning", "minor fault", "adjustment needed"];
    if (lowKeywords.some(word => issueText.includes(word))) {
        return "Low";
    }

    return "Medium"; // Default severity
}

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        loggedInUser = null;
        res.redirect('/index.html');
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
