import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetClassStudents, useAddStudent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Users, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ClassDetailPage() {
  const { classId } = useParams({ strict: false });
  const { data: students, isLoading } = useGetClassStudents(BigInt(classId || '0'));
  const addStudent = useAddStudent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parentPhone: '',
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.parentPhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addStudent.mutateAsync({
        classId: BigInt(classId || '0'),
        name: formData.name,
        parentPhone: formData.parentPhone,
      });
      toast.success('Student added successfully');
      setFormData({ name: '', parentPhone: '' });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add student');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/teacher/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-2">Class Details</h1>
        <p className="text-muted-foreground">Manage students and take attendance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>{students?.length || 0}</CardTitle>
            <CardDescription>Students Enrolled</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              <Button asChild variant="default" size="sm" className="mt-2">
                <Link to="/teacher/class/$classId/attendance" params={{ classId: classId || '0' }}>Take Attendance</Link>
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Roster</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Add a student to this class with parent contact information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent Phone Number</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="+1234567890"
                />
                <p className="text-xs text-muted-foreground">
                  This phone number will be used to link the parent's account
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={addStudent.isPending}>
                {addStudent.isPending ? 'Adding...' : 'Add Student'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!students || students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No students yet</h3>
            <p className="text-muted-foreground mb-4">Add your first student to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Student
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Parent Phone</TableHead>
                  <TableHead>Student ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id.toString()}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.parentPhone}</TableCell>
                    <TableCell className="text-muted-foreground">{student.id.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
