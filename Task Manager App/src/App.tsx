import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchAndFilters } from './components/SearchAndFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { useTasks } from './hooks/useTasks';
import { isOverdue, isDueSoon } from './utils/dateUtils';

function App() {
  const {
    tasks,
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
  } = useTasks();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [allTasks, setAllTasks] = useState(0);

  // Load all tasks count for header
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      setAllTasks(parsedTasks.length);
    }
  }, [tasks]);

  // Check for overdue and due soon tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      const overdueTasks = parsedTasks.filter((task: any) => 
        isOverdue(task.dueDate) && task.status !== 'completed'
      );
      const dueSoonTasks = parsedTasks.filter((task: any) => 
        isDueSoon(task.dueDate) && task.status !== 'completed'
      );

      if (overdueTasks.length > 0) {
        console.log(`You have ${overdueTasks.length} overdue task(s)!`);
      }
      if (dueSoonTasks.length > 0) {
        console.log(`You have ${dueSoonTasks.length} task(s) due soon!`);
      }
    }
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header tasksCount={allTasks} onNewTask={() => setIsTaskFormOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        
        <TaskList
          tasks={tasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onReorderTasks={reorderTasks}
        />
      </main>

      <TaskForm
        isOpen={isTaskFormOpen}
        onSubmit={addTask}
        onCancel={() => setIsTaskFormOpen(false)}
      />
    </div>
  );
}

export default App;