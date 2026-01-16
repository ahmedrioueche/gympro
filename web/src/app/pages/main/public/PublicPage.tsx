import { Outlet } from "@tanstack/react-router";
import Nav from "../../../components/nav/Nav";

function PublicPage() {
  return (
    <Nav>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default PublicPage;
