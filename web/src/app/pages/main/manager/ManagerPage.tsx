import { Outlet } from '@tanstack/react-router';
import Nav from '../../../components/Nav';

function ManagerPage() {
  return (
    <Nav>
      <Outlet />
    </Nav>
  );
}

export default ManagerPage;
