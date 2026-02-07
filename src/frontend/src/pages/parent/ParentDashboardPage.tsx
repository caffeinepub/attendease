import { useState } from 'react';
import { useGetMyStudents, useGetStudentAttendanceHistory } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { POLLING_INTERVAL } from '../../lib/polling';

export default function ParentDashboardPage() {
  const { data: students, isLoading } = useGetMyStudents(POLLING_INTERVAL);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const selectedStudent = students?.find((s) => s.id.toString() === selectedStudentId);
  const { data: attendanceHistory } = useGetStudentAttendanceHistory(
    selectedStudentId ? BigInt(selectedStudentId) : null,
    POLLING_INTERVAL
  );

  const calculateMetrics = () => {
    if (!attendanceHistory || !selectedStudent) {
      return { totalSessions: 0, present: 0, absent: 0, percentage: 0 };
    }

    const totalSessions = attendanceHistory.length;
    const present = attendanceHistory.filter((record) =>
      record.presentStudents.some((id) => id.toString() === selectedStudent.id.toString())
    ).length;
    const absent = totalSessions - present;
    const percentage = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;

    return { totalSessions, present, absent, percentage };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your students...</p>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">View your child's attendance information</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No students linked</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your account is not yet linked to any students. Please ask your child's teacher to add your phone
              number when registering your child in their class.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground">View your child's attendance information</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Choose a student to view their attendance details</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id.toString()} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedStudent && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl">{metrics.percentage}%</CardTitle>
                <CardDescription>Attendance Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={metrics.percentage} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl">{metrics.totalSessions}</CardTitle>
                <CardDescription>Total Sessions</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-3xl">{metrics.present}</CardTitle>
                <CardDescription>Days Present</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle className="text-3xl">{metrics.absent}</CardTitle>
                <CardDescription>Days Absent</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Recent attendance records for {selectedStudent.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {!attendanceHistory || attendanceHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No attendance records yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attendanceHistory
                    .sort((a, b) => Number(b.date - a.date))
                    .slice(0, 10)
                    .map((record, index) => {
                      const isPresent = record.presentStudents.some(
                        (id) => id.toString() === selectedStudent.id.toString()
                      );
                      const date = new Date(Number(record.date));
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {isPresent ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="font-medium">{date.toLocaleDateString()}</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPresent
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
