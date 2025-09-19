import { useState, useCallback } from 'react';
import { Task, TaskFormData } from '../types/Task';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const addTask = useCallback((taskData: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, [setTasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return {
    tasks: filteredTasks,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
  };
}