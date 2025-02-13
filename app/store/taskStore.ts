
  // app/store/taskStore.ts
  import { create } from 'zustand';
  import { Task } from './types';
  
  interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (taskId: number, updatedTask: Partial<Task>) => void;
    deleteTask: (taskId: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getTasksByProject: (projectId: number) => Task[];
    getTasksByPriority: (priority: Task['priority']) => Task[];
    getCompletedTasks: () => Task[];
    getPendingTasks: () => Task[];
  }
  
  export const useTaskStore = create<TaskState>()((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) =>
      set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (taskId, updatedTask) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        ),
      })),
    deleteTask: (taskId) =>
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    getTasksByProject: (projectId) =>
      get().tasks.filter((task) => task.projectId === projectId),
    getTasksByPriority: (priority) =>
      get().tasks.filter((task) => task.priority === priority),
    getCompletedTasks: () =>
      get().tasks.filter((task) => task.completed),
    getPendingTasks: () =>
      get().tasks.filter((task) => !task.completed),
  }));
  