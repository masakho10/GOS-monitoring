// src/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'Azulgrana10',  
  database: 'apps'  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = db;
