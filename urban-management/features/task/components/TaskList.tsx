'use client';

import { TaskSummaryResponse } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: TaskSummaryResponse[];
  onTaskClick: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  console.log("tasks: ", tasks)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id)}
        />
      ))}
    </div>
  );
}