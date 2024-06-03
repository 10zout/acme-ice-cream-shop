const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

app.use(bodyParser.json());

// Get all flavors
app.get('/api/flavors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flavors');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single flavor by id
app.get('/api/flavors/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flavors WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Flavor not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new flavor
app.post('/api/flavors', async (req, res) => {
  const { name, is_favorite } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *',
      [name, is_favorite]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a flavor
app.put('/api/flavors/:id', async (req, res) => {
  const { name, is_favorite } = req.body;
  try {
    const result = await pool.query(
      'UPDATE flavors SET name = $1, is_favorite = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, is_favorite, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Flavor not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a flavor
app.delete('/api/flavors/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM flavors WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Flavor not found' });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
