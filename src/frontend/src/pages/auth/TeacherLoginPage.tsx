import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAuth } from '../../contexts/AuthContext';
import { useGetCallerProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap } from 'lucide-react';
import { validatePhoneNumber } from '../../lib/validation';
import { UserRole } from '../../backend';

export default function TeacherLoginPage() {
  const navigate = useNavigate();
  const { login: iiLogin, identity } = useInternetIdentity();
  const { login: authLogin } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetCallerProfile();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (identity && profile && profile.role === UserRole.teacher) {
      authLogin(profile.phoneNumber, UserRole.teacher);
      navigate({ to: '/teacher/dashboard' });
    }
  }, [identity, profile, authLogin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!identity) {
        await iiLogin();
        return;
      }

      if (!profile) {
        setErrors({ submit: 'Account not found. Please sign up first.' });
        setIsSubmitting(false);
        return;
      }

      if (profile.phoneNumber !== formData.phoneNumber) {
        setErrors({ submit: 'Invalid phone number or password.' });
        setIsSubmitting(false);
        return;
      }

      if (profile.role !== UserRole.teacher) {
        setErrors({ submit: 'This account is not registered as a teacher.' });
        setIsSubmitting(false);
        return;
      }

      authLogin(formData.phoneNumber, UserRole.teacher);
      navigate({ to: '/teacher/dashboard' });
    } catch (error: any) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Teacher Login</CardTitle>
          <CardDescription>Sign in to manage your classes and attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1234567890"
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || profileLoading}>
              {isSubmitting || profileLoading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/teacher/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
