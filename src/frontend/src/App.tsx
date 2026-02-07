import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import TeacherSignUpPage from './pages/auth/TeacherSignUpPage';
import TeacherLoginPage from './pages/auth/TeacherLoginPage';
import ParentSignUpPage from './pages/auth/ParentSignUpPage';
import ParentLoginPage from './pages/auth/ParentLoginPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import ClassDetailPage from './pages/teacher/ClassDetailPage';
import TakeAttendancePage from './pages/teacher/TakeAttendancePage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import RoleRouteGuard from './components/RoleRouteGuard';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const teacherSignUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/signup',
  component: TeacherSignUpPage,
});

const teacherLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/login',
  component: TeacherLoginPage,
});

const parentSignUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent/signup',
  component: ParentSignUpPage,
});

const parentLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent/login',
  component: ParentLoginPage,
});

const teacherDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/dashboard',
  component: () => (
    <RoleRouteGuard requiredRole="teacher">
      <TeacherDashboardPage />
    </RoleRouteGuard>
  ),
});

const classDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/class/$classId',
  component: () => (
    <RoleRouteGuard requiredRole="teacher">
      <ClassDetailPage />
    </RoleRouteGuard>
  ),
});

const takeAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/class/$classId/attendance',
  component: () => (
    <RoleRouteGuard requiredRole="teacher">
      <TakeAttendancePage />
    </RoleRouteGuard>
  ),
});

const parentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent/dashboard',
  component: () => (
    <RoleRouteGuard requiredRole="parent">
      <ParentDashboardPage />
    </RoleRouteGuard>
  ),
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  teacherSignUpRoute,
  teacherLoginRoute,
  parentSignUpRoute,
  parentLoginRoute,
  teacherDashboardRoute,
  classDetailRoute,
  takeAttendanceRoute,
  parentDashboardRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
