import { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetClassStudents, useTakeAttendance, useGetAttendance } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function TakeAttendancePage() {
  const { classId } = useParams({ strict: false });
  const { data: students, isLoading } = useGetClassStudents(BigInt(classId || '0'));
  const takeAttendance = useTakeAttendance();
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const dateTimestamp = new Date(selectedDate).getTime();
  const { data: existingAttendance } = useGetAttendance(BigInt(classId || '0'), BigInt(dateTimestamp));
  
  const [presentStudents, setPresentStudents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (existingAttendance) {
      const presentIds = new Set(existingAttendance.presentStudents.map(id => id.toString()));
      setPresentStudents(presentIds);
    } else {
      setPresentStudents(new Set());
    }
  }, [existingAttendance, selectedDate]);

  const toggleStudent = (studentId: string) => {
    setPresentStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const presentIds = Array.from(presentStudents).map(id => BigInt(id));
      await takeAttendance.mutateAsync({
        classId: BigInt(classId || '0'),
        date: BigInt(dateTimestamp),
        presentStudentIds: presentIds,
      });
      toast.success('Attendance saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save attendance');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/teacher/class/$classId" params={{ classId: classId || '0' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Class
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-2">Take Attendance</h1>
        <p className="text-muted-foreground">Mark students as present or absent</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose the date for this attendance record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </CardContent>
      </Card>

      {!students || students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No students in this class</h3>
            <p className="text-muted-foreground mb-4">Add students before taking attendance</p>
            <Button asChild>
              <Link to="/teacher/class/$classId" params={{ classId: classId || '0' }}>Go to Class Details</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>
                {presentStudents.size} of {students.length} students marked present
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const isPresent = presentStudents.has(student.id.toString());
                    return (
                      <TableRow key={student.id.toString()}>
                        <TableCell>
                          <Checkbox
                            checked={isPresent}
                            onCheckedChange={() => toggleStudent(student.id.toString())}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPresent
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/teacher/class/$classId" params={{ classId: classId || '0' }}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={takeAttendance.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {takeAttendance.isPending ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
