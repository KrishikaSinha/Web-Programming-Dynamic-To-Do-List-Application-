const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./db.sqlite", (err) => {
if (err) {
console.log(err);
} else {
console.log("Database connected");
}
});

db.run(`
CREATE TABLE IF NOT EXISTS tasks(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
priority TEXT DEFAULT 'Medium',
isDone INTEGER DEFAULT 0
)
`);


app.get("/tasks", (req, res) => {

db.all("SELECT * FROM tasks", [], (err, rows) => {

if (err) {
res.status(500).json({ error: err.message });
return;
}

res.json(rows);

});

});


app.post("/tasks", (req, res) => {

const { title, priority } = req.body;

db.run(
"INSERT INTO tasks(title, priority) VALUES (?,?)",
[title, priority],
function (err) {

if (err) {
res.status(500).json({ error: err.message });
return;
}

res.json({
message: "Task added",
id: this.lastID
});

}
);

});


app.patch("/tasks/:id/status", (req, res) => {

const id = req.params.id;

db.run(
"UPDATE tasks SET isDone = NOT isDone WHERE id = ?",
[id],
function (err) {

if (err) {
res.status(500).json({ error: err.message });
return;
}

res.json({ message: "Task updated" });

}
);

});

app.delete("/tasks/:id", (req, res) => {

const id = req.params.id;

db.run(
"DELETE FROM tasks WHERE id = ?",
[id],
function (err) {

if (err) {
res.status(500).json({ error: err.message });
return;
}

if (this.changes === 0) {
res.status(404).json({ message: "Task not found" });
return;
}

res.json({ message: "Task deleted" });

}
);

});

app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});