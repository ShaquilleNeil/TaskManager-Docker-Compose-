const express = require('express');
const cors = require('cors');

const Database = require('better-sqlite3');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());



const db = new Database('./data/tasks.db');


db.exec('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, completed INTEGER DEFAULT 0)');


// POST /tasks — create a new task
app.post('/tasks', (req, res) => {

    const { title, description, completed } = req.body;

    if (!title || title.trim() === '' || !description || description.trim() === '') {
        return res.status(400).json({ error: 'All fields are required' });
    }

   
    const result = db.prepare('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)')
        .run(title, description, completed ? 1 : 0);

    
    res.status(201).json({
        id: result.lastInsertRowid,
        title,
        description,
        completed: !!completed
    });
});


// GET /tasks — return all tasks
app.get('/tasks', (req, res) => {

    
    const rows = db.prepare('SELECT * FROM tasks').all();

    const tasks = rows.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: !!task.completed  // convert 0/1 back to false/true
    }));

    res.json(tasks);
});


// PUT /tasks/:id — update a task
app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;

    // .get() replaces db.get() with a callback — returns one row or undefined
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const updateTitle       = req.body.title       !== undefined ? req.body.title       : task.title;
    const updateDescription = req.body.description !== undefined ? req.body.description : task.description;
    const updateCompleted   = req.body.completed   !== undefined ? (req.body.completed ? 1 : 0) : task.completed;

   
    db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?')
        .run(updateTitle, updateDescription, updateCompleted, id);

    res.json({
        id,
        title: updateTitle,
        description: updateDescription,
        completed: !!updateCompleted
    });
});


// DELETE /tasks/:id — delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;

    // result.changes replaces this.changes from the sqlite3 callback
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});