const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const tableName = 'xxocm_mvt_stock_zsmart';
const columnName = 'interface_status';

app.get('/api/total_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableName} WHERE ${columnName} = 'S';`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total success logs');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/api/total_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableName} WHERE ${columnName} = 'E';`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total error logs');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/api/success_percentage', (req, res) => {
  const query = `
    SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableName} WHERE ${columnName} = 'S') AS success_log, 
        (SELECT COUNT(*) FROM ${tableName} WHERE ${columnName} = 'E') AS error_log 
    ) AS logs_counts;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});

const port = 3333;
app.listen(port, () => console.log(`Server running on port ${port}`));
