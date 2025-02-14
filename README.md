<!-- # Task management system

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
- useTaskStats() -->

# Personal Task Management System

A modern, full-stack task management application built with Next.js 15, PostgreSQL, Drizzle ORM, and React Query. This application helps users organize their daily tasks and projects with a clean, intuitive interface.

## 🚀 Features

### Core Functionality
- **User Authentication**
  - Secure registration and login
  - Protected routes and API endpoints
  - JWT-based authentication

- **Task Management**
  - Create, read, update, and delete tasks
  - Priority levels (low, medium, high)
  - Due dates and recurrence settings
  - Task categorization via projects

- **Project Organization**
  - Create and manage projects
  - Group related tasks
  - Project-specific task views

- **Dashboard**
  - Task statistics and metrics
  - Upcoming deadlines
  - Task completion progress
  - Calendar widget

### Technical Features
- Responsive design
- Real-time updates using React Query
- Global state management with Zustand
- Type-safe database operations with Drizzle ORM
- Modern UI components using shadcn/ui

## 🛠 Tech Stack

- **Frontend**
  - Next.js 15 (App Router)
  - TypeScript
  - TailwindCSS
  - Framer Motion (animations)
  - Zustand (state management)
  - React Query (data fetching)
  - shadcn/ui (UI components)

- **Backend**
  - Next.js API Routes
  - PostgreSQL
  - Drizzle ORM
  - JWT Authentication

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── (components)/        # Component groups
│   │   ├── auth/           # Authentication components
│   │   └── dashboard/      # Dashboard components
│   ├── (routes)/           # Route groups
│   │   ├── (auth)/        # Auth routes (login/register)
│   │   └── (dashboard)/   # Dashboard routes
│   ├── api/                # API routes
│   ├── db/                 # Database configuration
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── store/             # Zustand stores
├── components/             # Shared UI components
├── public/                # Static assets
└── styles/                # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Bun (recommended) or npm

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Copy the example environment file and update it with your values:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
bun run db:push
# or
npm run db:push
```

5. Start the development server:
```bash
bun dev
# or
npm run dev
```

## 📝 Database Schema

### Users Table
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

### Tasks Table
```typescript
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  userId: integer('user_id').references(() => users.id),
  priority: text('priority').notNull().default('medium'),
  dueDate: timestamp('due_date'),
  projectId: integer('project_id').references(() => projects.id),
  recurrence: text('recurrence'),
  recurrenceEnd: timestamp('recurrence_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
```

### Projects Table
```typescript
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

## 🔒 API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/tasks/[id]` - Get tasks for specific project

## 🔧 Development

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow component-based architecture

### State Management
- Use Zustand for global state
- Use React Query for server state
- Keep component state local when possible

### Database Operations
- Use Drizzle ORM for type-safe queries
- Follow migration best practices
- Implement proper error handling

## 🧪 Testing

```bash
# Run unit tests
bun test
# or
npm run test

# Run e2e tests
bun test:e2e
# or
npm run test:e2e
```

## 📦 Deployment

1. Build the application:
```bash
bun run build
# or
npm run build
```

2. Start the production server:
```bash
bun start
# or
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.