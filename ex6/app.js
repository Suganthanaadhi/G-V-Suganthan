const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');  // Import body-parser

const app = express();
const PORT = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GVS@2004aadhi', // Replace with your MySQL password
    database: 'employee_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Middleware
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,  // Use the generated secret key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // You may want to increase maxAge for longer session duration
}));

app.use(bodyParser.urlencoded({ extended: true }));  // Add this line to parse URL-encoded data
app.use(bodyParser.json());  // Add this line to parse JSON data

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error comparing password');
                }

                if (isMatch) {
                    // Store user information in session, including the employee_name
                    req.session.user = {
                        id: results[0].id,
                        name: results[0].employee_name  // Assuming 'employee_name' exists in 'users' table
                    };
                    res.redirect('/leave');
                } else {
                    res.send('Incorrect password');
                }
            });
        } else {
            res.send('User not found');
        }
    });
});

app.get('/leave', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'leave-form.html'));
    } else {
        res.redirect('/');
    }
});

app.post('/submit-leave', (req, res) => {
    const { startDate, endDate, reason } = req.body;
    const userId = req.session.user.id;
    const employeeName = req.session.user.name;  // Get employee name from session

    // Check if employeeName exists in session
    if (!employeeName) {
        return res.status(400).send('Employee name not found in session.');
    }

    const query = 'INSERT INTO leave_requests (user_id, employee_name, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [userId, employeeName, startDate, endDate, reason], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error occurred while submitting leave request');
        }
        res.send('Leave request submitted successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
