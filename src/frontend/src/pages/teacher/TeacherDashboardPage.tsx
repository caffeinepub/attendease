import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetTeacherClasses, useCreateClass } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen, Users, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherDashboardPage() {
  const { data: classes, isLoading } = useGetTeacherClasses();
  const createClass = useCreateClass();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [className, setClassName] = useState('');

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    try {
      await createClass.mutateAsync(className);
      toast.success('Class created successfully');
      setClassName('');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create class');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your classes, students, and attendance</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>{classes?.length || 0}</CardTitle>
            <CardDescription>Total Classes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>
              {classes?.reduce((acc, cls) => acc, 0) || 0}
            </CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your classes</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Classes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>Add a new class to manage students and attendance</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g., Math 101, Grade 5A"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createClass.isPending}>
                {createClass.isPending ? 'Creating...' : 'Create Class'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!classes || classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-4">Create your first class to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card key={cls.id.toString()} className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {cls.name}
                </CardTitle>
                <CardDescription>Class ID: {cls.id.toString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="default" className="w-full">
                  <Link to="/teacher/class/$classId" params={{ classId: cls.id.toString() }}>View Details</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/teacher/class/$classId/attendance" params={{ classId: cls.id.toString() }}>Take Attendance</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
