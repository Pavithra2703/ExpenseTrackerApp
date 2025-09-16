const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let expenses = [];

// Add a new expense
app.post('/expenses', (req, res) => {
  const { description, amount, category, date } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newExpense = { id: expenses.length + 1, description, amount: parseFloat(amount), category, date };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Get all expenses
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

// Get analytics - total spent per category
app.get('/analytics/category', (req, res) => {
  const analytics = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  res.json(analytics);
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
