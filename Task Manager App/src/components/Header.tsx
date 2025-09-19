import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

interface HeaderProps {
  tasksCount: number;
  onNewTask: () => void;
}

export function Header({ tasksCount, onNewTask }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">{tasksCount} tasks total</p>
            </div>
          </div>
          
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}