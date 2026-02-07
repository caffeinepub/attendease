import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, CheckCircle, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <div className="mb-8">
          <img
            src="/assets/generated/attendease-hero.dim_1600x600.png"
            alt="ATTENDEASE Hero"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Welcome to ATTENDEASE</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Simplify attendance tracking for teachers and keep parents informed in real-time
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">For Teachers</CardTitle>
            </div>
            <CardDescription className="text-base">
              Manage classes, students, and track attendance effortlessly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Create and manage multiple classes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Add students with parent contact information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Take attendance quickly and efficiently</span>
              </li>
            </ul>
            <div className="flex gap-2 pt-4">
              <Button asChild className="flex-1">
                <Link to="/teacher/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/teacher/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">For Parents</CardTitle>
            </div>
            <CardDescription className="text-base">
              Stay informed about your child's attendance in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>View attendance percentage and statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Track total attendance and absences</span>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Receive automatic updates when attendance is taken</span>
              </li>
            </ul>
            <div className="flex gap-2 pt-4">
              <Button asChild className="flex-1">
                <Link to="/parent/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/parent/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <div className="space-y-4 text-left">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Teachers create accounts and add classes</h3>
              <p className="text-muted-foreground">Set up your classes and add students with parent phone numbers</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Parents sign up using their phone number</h3>
              <p className="text-muted-foreground">Use the same phone number the teacher added for your child</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Teachers take attendance</h3>
              <p className="text-muted-foreground">Mark students present or absent with just a few clicks</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Parents see updates automatically</h3>
              <p className="text-muted-foreground">View real-time attendance statistics and history</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
