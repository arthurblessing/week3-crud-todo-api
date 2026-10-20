const express = require('express');
const app = express();

app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All Todos – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET Active Todos – Array Bonus
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  res.status(200).json(activeTodos);
});

// GET Completed Todos
app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  res.status(200).json(completedTodos);
});

// GET Single Todo by ID – Read
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
});

// POST New Todo – Create with Validation
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({
      error: 'Task is required and must be a non-empty string',
    });
  }

  const newTodo = {
    id: todos.length > 0
      ? Math.max(...todos.map((todo) => todo.id)) + 1
      : 1,
    task: task.trim(),
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// PATCH Todo – Partial Update
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'task') &&
    (typeof req.body.task !== 'string' || req.body.task.trim() === '')
  ) {
    return res.status(400).json({
      error: 'Task must be a non-empty string',
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'completed') &&
    typeof req.body.completed !== 'boolean'
  ) {
    return res.status(400).json({
      error: 'Completed must be true or false',
    });
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'task')) {
    req.body.task = req.body.task.trim();
  }

  Object.assign(todo, req.body);

  res.status(200).json(todo);
});

// DELETE Todo – Remove
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send();
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
