import React from 'react';
import { cn } from '../../utils/helper';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      <div className='flex items-center justify-center mb-4'>{icon}</div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white text-center mb-2'>
        {title}
      </h3>
      <p className='text-sm text-gray-600 dark:text-gray-300 text-center leading-5'>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
