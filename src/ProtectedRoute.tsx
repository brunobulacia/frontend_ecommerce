import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface props {
  isAllowed: boolean;
  children?: React.ReactNode;
}

function ProtectedRoute({ isAllowed, children }: props) {
  if (!isAllowed) return <Navigate to="/login" />;
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;