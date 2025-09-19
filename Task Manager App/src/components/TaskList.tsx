import React, { useState } from 'react';
import { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onReorderTasks }: TaskListProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    const dragIndex = tasks.findIndex(task => task.id === draggedTask.id);
    if (dragIndex === dropIndex) return;
    
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(dragIndex, 1);
    newTasks.splice(dropIndex, 0, removed);
    
    onReorderTasks(newTasks);
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started with managing your productivity!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, index)}
          className={`transition-all duration-200 ${
            dragOverIndex === index ? 'transform translate-y-1' : ''
          }`}
        >
          <TaskCard
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            isDragging={draggedTask?.id === task.id}
          />
        </div>
      ))}
    </div>
  );
}