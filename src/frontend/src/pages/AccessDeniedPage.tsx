import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-fit">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this area. Please log in with the correct account type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild variant="default">
              <Link to="/">Go to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/teacher/login">Teacher Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/parent/login">Parent Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
