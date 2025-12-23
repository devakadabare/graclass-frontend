import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const lecturerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  qualifications: z.string().optional(),
});

const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  university: z.string().optional(),
  studentId: z.string().optional(),
});

type LecturerFormData = z.infer<typeof lecturerSchema>;
type StudentFormData = z.infer<typeof studentSchema>;

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'lecturer'>('student');
  const { registerLecturer, registerStudent, isLoading } = useAuth();

  const lecturerForm = useForm<LecturerFormData>({
    resolver: zodResolver(lecturerSchema),
  });

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onLecturerSubmit = (data: LecturerFormData) => {
    registerLecturer(data);
  };

  const onStudentSubmit = (data: StudentFormData) => {
    registerStudent(data);
  };

  return (
    <AuthLayout title="Create an account" subtitle="Choose your account type">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'student' | 'lecturer')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-firstName">First Name</Label>
                <Input id="student-firstName" {...studentForm.register('firstName')} />
                {studentForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{studentForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-lastName">Last Name</Label>
                <Input id="student-lastName" {...studentForm.register('lastName')} />
                {studentForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{studentForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <Input id="student-email" type="email" {...studentForm.register('email')} />
              {studentForm.formState.errors.email && (
                <p className="text-sm text-destructive">{studentForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-password">Password</Label>
              <Input id="student-password" type="password" {...studentForm.register('password')} />
              {studentForm.formState.errors.password && (
                <p className="text-sm text-destructive">{studentForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-university">University (Optional)</Label>
              <Input id="student-university" {...studentForm.register('university')} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Student Account'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="lecturer">
          <form onSubmit={lecturerForm.handleSubmit(onLecturerSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lecturer-firstName">First Name</Label>
                <Input id="lecturer-firstName" {...lecturerForm.register('firstName')} />
                {lecturerForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{lecturerForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lecturer-lastName">Last Name</Label>
                <Input id="lecturer-lastName" {...lecturerForm.register('lastName')} />
                {lecturerForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{lecturerForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturer-email">Email</Label>
              <Input id="lecturer-email" type="email" {...lecturerForm.register('email')} />
              {lecturerForm.formState.errors.email && (
                <p className="text-sm text-destructive">{lecturerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturer-password">Password</Label>
              <Input id="lecturer-password" type="password" {...lecturerForm.register('password')} />
              {lecturerForm.formState.errors.password && (
                <p className="text-sm text-destructive">{lecturerForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturer-qualifications">Qualifications (Optional)</Label>
              <Textarea id="lecturer-qualifications" {...lecturerForm.register('qualifications')} placeholder="PhD, MSc, etc." />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Lecturer Account'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
