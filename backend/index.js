//basic express server setup

const express = require('express');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());


//storage
let tasks = [];
let currentId = 1;


//create task POST


//req = request, res = response
app.post('/tasks', (req, res) => {

    //get task data from request body
    const { title, description, completed } = req.body;

    if(!title || title.trim() === '' || !description || description.trim() === ''){
        return res.status(400).json({ error: 'All fields are required' });
    };

    // assign to task 
    const newTask ={
        id: currentId++,
        title,
        description,
        completed: completed ?? false
    };



    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
 
    res.json(tasks);
});

app.put('/tasks/:id', (req, res) => {
   const id = parseInt(req.params.id);
     
   const task = tasks.find(t => t.id === id);

   //validate task exists
    if (!task) {
     return res.status(404).json({ error: 'Task not found' });
    }

    if(req.body.title !== undefined){
        task.title = req.body.title;
    }
    
    if(req.body.description !== undefined){
        task.description = req.body.description;
    }
    
    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

   res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    //find the task
    const task = tasks.find(t => t.id === id);

    //validate task exists
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    //remove task by filtering a new list without it
    tasks = tasks.filter(t => t.id !== id);

    // res.sendStatus(204); //means the delete was successful but no content to return

    //return updated list of tasks
    res.json(tasks);


});


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});