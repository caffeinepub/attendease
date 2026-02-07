import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../backend';
import { useEffect } from 'react';

interface RoleRouteGuardProps {
  children: ReactNode;
  requiredRole: 'teacher' | 'parent';
}

export default function RoleRouteGuard({ children, requiredRole }: RoleRouteGuardProps) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate({ to: `/${requiredRole}/login` });
      return;
    }

    if (currentUser?.role !== requiredRole) {
      navigate({ to: '/access-denied' });
    }
  }, [isAuthenticated, currentUser, requiredRole, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || currentUser?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
