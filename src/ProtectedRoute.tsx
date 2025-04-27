import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface authProps {
  isAllowed: boolean;
  children?: React.ReactNode;
}

interface adminProps {
  rol: number;
  children?: React.ReactNode;
}

function ProtectedRoute({ isAllowed, children }: authProps) {
  if (!isAllowed) return <Navigate to="/login" />;
  return children ? <>{children}</> : <Outlet />;
}

export function AdminRoute({ rol, children }: adminProps) {
  if (rol != 1) return <Navigate to="/inicio" />;
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
