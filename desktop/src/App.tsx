import { useEffect, useState } from 'react';

function App() {
  const [electronInfo, setElectronInfo] = useState<any>(null);

  useEffect(() => {
    if (window.electron) {
      setElectronInfo(window.electron);
    }
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-2xl p-8 max-w-md w-full'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4 text-center'>Hello World! 👋</h1>
        <p className='text-gray-600 text-center mb-6'>Welcome to GymPro Desktop Application</p>

        {electronInfo && (
          <div className='bg-gray-100 rounded p-4 mb-4'>
            <h2 className='font-semibold text-gray-800 mb-2'>Electron Info:</h2>
            <p className='text-sm text-gray-600'>Platform: {electronInfo.platform}</p>
            <p className='text-sm text-gray-600'>Electron: {electronInfo.versions.electron}</p>
            <p className='text-sm text-gray-600'>Node: {electronInfo.versions.node}</p>
          </div>
        )}

        <div className='text-center'>
          <button className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
