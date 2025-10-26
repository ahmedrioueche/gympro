import { Outlet } from '@tanstack/react-router';
import { OnboardingProvider } from './context/OnboardingContext';

const App = () => {
  return (
    <OnboardingProvider>
      <div className='font-primary max-w-[1920px]'>
        <Outlet />
      </div>
    </OnboardingProvider>
  );
};

export default App;
