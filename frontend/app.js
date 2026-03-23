const api_url = "http://localhost:4000/tasks";



async function loadTasks(){

    try {
        //call the api to get the tasks
        const response = await fetch(api_url);

        if (!response.ok) {
            console.error('Failed to fetch tasks');
            return;
        }
    
        //capture the tasks from the response
        const tasks = await response.json();
    
        //find task list in dom
        const list = document.getElementById('taskList');
        if (!list) {
            console.error('Task list not found');
            return;
        }

        //edit
        list.innerHTML = '';
    
        const taskCount = document.getElementById('taskCount');
        if (!taskCount) {
            throw new Error('Task count not found');
        }

        taskCount.textContent = `Total Tasks: ${tasks.length || 0}`;
    
        tasks.forEach(task => {

            if(!Array.isArray(task)){
                console.log("Invalid task data");
                return;
            }

            //create a new list item for each task
            const li = document.createElement('li');
    
            li.className = "flex justify-between items-center p-2";
    
            li.innerHTML = `
            <div class ="bg-gray-100 rounded-3xl p-4 flex justify-between items-center w-full">
    
            <div class="flex items-start gap-3">
            <input type="checkbox" class="mt-1" ${task.completed ? 'checked' : ''}
            onchange="toggleTask(${task.id}, this.checked)" />
    
            <div class="flex flex-col">
            <span class="font-semibold ${task.completed ? 'line-through text-gray-400' : ''}">${task.title || 'No title'}</span>
            <span class="text-gray-500 text-sm">${task.description || 'No description'}</span>
            
            <span class="mt-2 text-xs px-2 py-1 rounded ${task.completed ? 'bg-green-100 text-green-600 w-fit' : 'bg-red-100 text-red-600 w-fit'}">${task.completed ? 'Completed' : 'Not Completed'}</span>
            </div>
            
            </div>
             
               <div class="flex gap-2">
               <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="updateTask(${task.id})">Update</Button>
               <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteTask(${task.id})">Delete</Button>
               </div>
            
             </div>
            `;
    
    
            //add the list item to the task list
            list.appendChild(li);
        });
    
        
    }
    catch (error) {
        alert("Error loading tasks");
    }

  

};


async function addTask(){
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const completed = document.getElementById('completed').checked;

    if(!title || title.trim() === '' || !description || description.trim() === ''){
        return alert('All fields are required');
    };

     await fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, completed })
     });

document.getElementById('title').value = '';
document.getElementById('description').value = '';
document.getElementById('completed').checked = false;

     loadTasks();
     

};

async function updateTask(id){

    // find the task manually
    const response = await fetch(api_url);
    const tasks = await response.json();
    const task = tasks.find(t => t.id === id);

    const newTitle = prompt("Enter new title:", task.title);
    const newDescription = prompt("Enter new description:", task.description);
    const newCompleted = confirm("Is the task completed?");

    if (newTitle === null || newDescription === null || newCompleted === null) return;

    await fetch(`${api_url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            completed: newCompleted
        })
    });

    loadTasks();
}


async function deleteTask(id){
    await fetch(`${api_url}/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}

async function toggleTask(id, completed){
await fetch(`${api_url}/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
});

loadTasks();
};

loadTasks();
