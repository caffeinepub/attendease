import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, GraduationCap, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/attendease-logo.dim_512x512.png"
              alt="ATTENDEASE"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold tracking-tight">ATTENDEASE</span>
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {currentUser.role === 'teacher' ? (
                    <GraduationCap className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  <span className="capitalize">{currentUser.role}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {currentUser.name || currentUser.phoneNumber}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/teacher/login">Teacher Login</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/parent/login">Parent Login</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
