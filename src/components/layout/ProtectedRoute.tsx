import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { Role } from '../../types';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Unauthorized, go to dashboard
    }

    return <Outlet />;
};

export default ProtectedRoute;
