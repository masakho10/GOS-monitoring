const express = require('express');
const path = require('path');
const db = require('./db'); // Ensure your database connection is correctly imported
const cors = require('cors');
const bcrypt = require('bcrypt'); // For hashing passwords
const app = express();

app.use(cors());
app.use(express.json());

let tableConfig = {
  table: 'log',
  column: 'status',
};

// Middleware for updating table configuration
app.post('/api/config', (req, res) => {
  const { table, column } = req.body;
  tableConfig.table = table;
  tableConfig.column = column;
  res.json({ message: 'Configuration updated successfully' });
});

// Endpoint for checking login information
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM utilisateur WHERE email_utilisateur = ? and password = ?;`

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching user');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        res.json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Endpoint for registering new users
app.post('/api/register', async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO utilisateur (nom, prenom, email_utilisateur, role, password) VALUES (?, ?, ?, ?, ?);`

  db.query(query, [nom, prenom, email, role, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error registering user');
      return;
    }

    res.json({ message: 'Registration successful' });
  });
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Login.tsx')); // Ensure the path is correct
});




//clients
app.get('/api/clients', (req, res) => {
  const query = `SELECT message_erreur, label_reference_value,status, date_creation, date_MAJ FROM ${tableConfig.table} WHERE interface_id = 1 limit 50;`
  db.query(query, (err, results) => {
    if (err) { 
      console.error('Error executing query', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

//success_log
app.get('/api/clients_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 1;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total orders');
      return;
    }
    res.json(results[0]);
  });
});


//error_log
app.get('/api/clients_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 1;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching latest orders');
      return;
    }
    res.json(results[0]);
  });
});


//success_percentage
app.get('/api/clients_success_percentage', (req, res) => {
  const query = 
    `SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 1) AS success_log, 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 1) AS error_log 
    ) AS logs_counts;`
  ;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});







//Entete-facture
app.get('/api/entete-facture', (req, res) => {
  const query = `SELECT message_erreur, label_reference_value,status, date_creation, date_MAJ FROM ${tableConfig.table} WHERE interface_id = 2 and status = "E";`
  db.query(query, (err, results) => {
    if (err) { 
      console.error('Error executing query', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

//success_log
app.get('/api/entete_facture_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 2;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total orders');
      return;
    }
    res.json(results[0]);
  });
});


//error_log
app.get('/api/entete_facture_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 2;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching latest orders');
      return;
    }
    res.json(results[0]);
  });
});


//success_percentage
app.get('/api/entete_facture_success_percentage', (req, res) => {
  const query = 
    `SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 2) AS success_log, 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 2) AS error_log 
    ) AS logs_counts;`
  ;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});













//Mouvement stock 
app.get('/api/mvt-stock', (req, res) => {
  const query = `SELECT message_erreur, label_reference_value,status, date_creation, date_MAJ FROM ${tableConfig.table} WHERE interface_id = 3 and status = "E";`
  db.query(query, (err, results) => {
    if (err) { 
      console.error('Error executing query', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

//success_log
app.get('/api/mvt_stock_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 3;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total orders');
      return;
    }
    res.json(results[0]);
  });
});


//error_log
app.get('/api/mvt_stock_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 3;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching latest orders');
      return;
    }
    res.json(results[0]);
  });
});


//success_percentage
app.get('/api/mvt_stock_success_percentage', (req, res) => {
  const query = 
    `SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 3) AS success_log, 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 3) AS error_log 
    ) AS logs_counts;`
  ;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});










//Paiements
app.get('/api/paiements', (req, res) => {
  const query = `SELECT message_erreur, label_reference_value,status, date_creation, date_MAJ FROM ${tableConfig.table} WHERE interface_id = 4 and status = "E";`
  db.query(query, (err, results) => {
    if (err) { 
      console.error('Error executing query', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

//success_log
app.get('/api/paiements_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 4;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total orders');
      return;
    }
    res.json(results[0]);
  });
});


//error_log
app.get('/api/paiements_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 4;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching latest orders');
      return;
    }
    res.json(results[0]);
  });
});


//success_percentage
app.get('/api/paiements_success_percentage', (req, res) => {
  const query = 
   `SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S' and interface_id = 4) AS success_log, 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E' and interface_id = 4) AS error_log 
    ) AS logs_counts;`
  ;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});









//GLOBAL 
//success_log
app.get('/api/total_success_log', (req, res) => {
  const query = `SELECT COUNT(*) AS success_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S';`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching total orders');
      return;
    }
    res.json(results[0]);
  });
});


//error_log
app.get('/api/total_error_log', (req, res) => {
  const query = `SELECT COUNT(*) AS error_log FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E';`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching latest orders');
      return;
    }
    res.json(results[0]);
  });
});


//success_percentage
app.get('/api/success_percentage', (req, res) => {
  const query = 
    `SELECT ROUND(success_log * 100.0 / (success_log + error_log), 2) AS success_percentage 
    FROM ( 
      SELECT 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'S') AS success_log, 
        (SELECT COUNT(*) FROM ${tableConfig.table} WHERE ${tableConfig.column} = 'E') AS error_log 
    ) AS logs_counts;`
  ;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching success percentage');
      return;
    }
    res.json(results[0]);
  });
});


const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
