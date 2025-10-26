import React from 'react';
import { cn } from '../../utils/helper';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 hover:scale-105',
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
        className
      )}
    >
      <div className='flex flex-col items-center text-center'>
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mb-4',
            isSelected ? 'bg-primary/10 dark:bg-primary/20' : 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            'text-lg font-semibold mb-2',
            isSelected ? 'text-primary dark:text-primary-300' : 'text-gray-900 dark:text-white'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm leading-5',
            isSelected
              ? 'text-primary/80 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-300'
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default RoleCard;
