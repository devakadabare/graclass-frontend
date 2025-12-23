import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { lecturerApi } from '@/api/lecturer.api';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z.string().optional(),
  university: z.string().optional(),
  studentId: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function StudentRegistrationPage() {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: StudentFormData) => lecturerApi.createStudent(data),
    onSuccess: (data) => {
      toast.success(`Student account created successfully for ${data.email}`);
      reset();
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create student account');
    },
  });

  const onSubmit = (data: StudentFormData) => {
    createMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Register New Student</h1>
          <p className="text-muted-foreground">
            Create student accounts for your courses
          </p>
        </div>

        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Student Information
          </CardTitle>
          <CardDescription>
            Enter the student's details to create their account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="John"
              />

              <FormInput
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Doe"
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john.doe@student.com"
            />

            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={errors.password?.message}
              placeholder="Must include uppercase, lowercase, and number"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showPassword" className="text-sm">
                Show password
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Phone (Optional)"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+1234567890"
              />

              <FormInput
                label="University (Optional)"
                {...register('university')}
                error={errors.university?.message}
                placeholder="University of California"
              />
            </div>

            <FormInput
              label="Student ID (Optional)"
              {...register('studentId')}
              error={errors.studentId?.message}
              placeholder="STU12345"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={createMutation.isPending}
              >
                Clear Form
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Student Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
