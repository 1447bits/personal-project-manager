# Task management system

### api route details

// tasks routes:
- GET /api/tasks (list all tasks)
- POST /api/tasks (create task)
- PUT /api/tasks/:id (update task)
- DELETE /api/tasks/:id (delete task)

// projects routes:
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

**sample requests**
// Tasks
- GET    /api/tasks
- POST   /api/tasks         { title: "New Task", description: "Details", priority: "high", projectId: 1, userId: 1 }
- PUT    /api/tasks/1       { title: "Updated Task", completed: true }
- DELETE /api/tasks/1

// Projects
- GET    /api/projects
- POST   /api/projects      { name: "New Project", description: "Details", userId: 1 }
- PUT    /api/projects/1    { name: "Updated Project" }
- DELETE /api/projects/1


### Zustland Stored

- authStore (user session)
- taskStore (task management)
- projectStore (project management)

### Hooks for query fetching

- useUsers()
- useTasks()
- useProjects()
- useTaskStats()