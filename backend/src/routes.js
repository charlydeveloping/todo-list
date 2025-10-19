import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { pool } from './db.js';

const router = Router();

// Helper to map DB row to API object
function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    created_at: row.created_at
  };
}

router.get('/tasks', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC');
    res.json(rows.map(mapTask));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/tasks',
  body('title').isString().trim().isLength({ min: 1, max: 255 }).withMessage('title is required (1-255 chars)'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING id, title, completed, created_at',
        [title, false]
      );
      res.status(201).json(mapTask(rows[0]));
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/tasks/:id',
  param('id').isInt().toInt(),
  body('title').optional().isString().trim().isLength({ min: 1, max: 255 }),
  body('completed').optional().isBoolean().toBoolean(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;
      const fields = [];
      const values = [];
      let idx = 1;

      if (req.body.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(req.body.title);
      }
      if (req.body.completed !== undefined) {
        fields.push(`completed = $${idx++}`);
        values.push(req.body.completed);
      }
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      values.push(id);
      const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, title, completed, created_at`;
      const result = await pool.query(sql, values);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
      res.json(mapTask(result.rows[0]));
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/tasks/:id',
  param('id').isInt().toInt(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;
      const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
