export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}