const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "hamna123", // <-- Apna MySQL password yahan likhein
  database: "student_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected!");
});

// READ
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch students" });
    res.json(results);
  });
});

// CREATE
app.post("/students", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });
  db.query("INSERT INTO students (name, email) VALUES (?, ?)", [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add student" });
    res.json({ message: "Student added successfully!", id: result.insertId });
  });
});

// UPDATE (Task 1)
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query("UPDATE students SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update student" });
    res.json({ message: "Student updated successfully!" });
  });
});

// DELETE (Task 1)
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete student" });
    res.json({ message: "Student deleted successfully!" });
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
