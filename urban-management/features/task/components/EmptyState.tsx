'use client';

import { Search, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onReset?: () => void;
}

export default function EmptyState({ title, description, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
        <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Filters
        </button>
      )}
    </div>
  );
}