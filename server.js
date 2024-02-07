const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const port = 3005;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'art_gallery',
  port: 8889,
  multipleStatements: true
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

const getFormValidation = () => {
  return [
    body('fname').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lname').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('gender').trim().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('mobile').trim().isMobilePhone().withMessage('Invalid mobile number'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('dob').trim().isISO8601().toDate().withMessage('Invalid date format'),
    body('language').trim().isAlpha().withMessage('Invalid language. Only alphabets are allowed.'),
    body('message').trim().escape(),
    body('instagram')
  .trim()
  .custom(value => {
    if (!/^@?[\w]+$/.test(value)) {
      throw new Error('Invalid Instagram username. Only letters, numbers, and underscores are allowed.');
    }
    return true;
  })


  ];
};

const printErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.post('/submit', getFormValidation(), printErrors, (req, res) => {
  const { fname, lname, gender, mobile, email, dob, language, message, instagram } = req.body;

  const sql = 'INSERT INTO artwork_submissions (fname, lname, gender, mobile, email, dob, language, message, instagram) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [fname, lname, gender, mobile, email, dob, language, message, instagram];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect(`/submission-success?fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&gender=${encodeURIComponent(gender)}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}&dob=${encodeURIComponent(dob)}&language=${encodeURIComponent(language)}&message=${encodeURIComponent(message)}&instagram=${encodeURIComponent(instagram)}`);
  });
});

app.get('/submission-success', (req, res) => {
  const { fname, lname, gender, mobile, email, dob, language, message } = req.query;
  const filePath = path.join(__dirname, 'public', 'success.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err.stack);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/display', (req, res) => {
  connection.query('SELECT * FROM artwork_submissions', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
