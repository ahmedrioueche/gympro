import React from 'react';
import { handleLogout } from '../../utils/auth';
import LogoutButton from '../ui/LogoutButton';

const LogoutExample: React.FC = () => {
  const handleCustomLogout = () => {
    console.log('Custom logout logic executed');
    // You can add custom logic here before logout
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-xl font-semibold'>Logout Examples</h2>

      <div className='space-y-4'>
        {/* Default button */}
        <div>
          <h3 className='font-medium mb-2'>Default Button:</h3>
          <LogoutButton />
        </div>

        {/* Link style */}
        <div>
          <h3 className='font-medium mb-2'>Link Style:</h3>
          <LogoutButton variant='link'>Sign Out</LogoutButton>
        </div>

        {/* Icon style */}
        <div>
          <h3 className='font-medium mb-2'>Icon Style:</h3>
          <LogoutButton variant='icon'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
          </LogoutButton>
        </div>

        {/* With custom callback */}
        <div>
          <h3 className='font-medium mb-2'>With Custom Callback:</h3>
          <LogoutButton onLogout={handleCustomLogout}>Logout with Callback</LogoutButton>
        </div>

        {/* Direct function call */}
        <div>
          <h3 className='font-medium mb-2'>Direct Function Call:</h3>
          <button
            onClick={() => handleLogout('/auth/login')}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Direct Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutExample;
