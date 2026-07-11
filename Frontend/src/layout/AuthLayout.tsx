import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;