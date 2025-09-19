import React, { useState } from 'react';
import { Calendar, Clock, Edit3, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { Task } from '../types/Task';
import { formatDate, isOverdue, isDueSoon, getDaysUntilDue } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

const priorityColors = {
  low: 'from-green-400 to-green-600',
  medium: 'from-yellow-400 to-orange-500',
  high: 'from-red-400 to-red-600',
};

const statusColors = {
  pending: 'bg-orange-100 text-orange-800 border-orange-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

export function TaskCard({ task, onUpdate, onDelete, isDragging }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  const handleSaveEdit = () => {
    onUpdate(task.id, editData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onUpdate(task.id, { status: newStatus });
  };

  const overdue = isOverdue(task.dueDate);
  const dueSoon = isDueSoon(task.dueDate);
  const daysUntil = getDaysUntilDue(task.dueDate);

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
        isDragging ? 'opacity-50 rotate-2 scale-95' : ''
      } ${overdue && task.status !== 'completed' ? 'ring-2 ring-red-200' : ''}`}
    >
      {/* Priority Indicator */}
      <div className={`h-1 w-full rounded-t-xl bg-gradient-to-r ${priorityColors[task.priority]}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="font-semibold text-gray-900 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
              ) : (
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h3>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
              className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>

        {/* Priority and Due Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <select
                value={editData.priority}
                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r text-white ${priorityColors[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            {overdue && task.status !== 'completed' ? (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Overdue</span>
              </div>
            ) : dueSoon && task.status !== 'completed' ? (
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {daysUntil === 0 ? 'Due today' : `${daysUntil} days left`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="text-sm border border-gray-200 rounded px-1 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <span>{formatDate(task.dueDate)}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['pending', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  task.status === status
                    ? statusColors[status]
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          {isEditing && (
            <button
              onClick={handleSaveEdit}
              className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}