import { Outlet } from '@tanstack/react-router';

const App = () => {
  return (
    <div className='font-primary max-w-[1920px]'>
      <Outlet />
    </div>
  );
};

export default App;
