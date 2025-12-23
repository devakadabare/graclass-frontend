import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useStudentProfile } from '@/hooks/useStudent';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  university: z.string().optional(),
  studentId: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useStudentProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile ? {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      university: profile.university || '',
      studentId: profile.studentId || '',
    } : undefined,
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your student profile information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Jane"
                />

                <FormInput
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Smith"
                />
              </div>

              <FormInput
                label="Email"
                value={profile?.email}
                disabled
                helperText="Email cannot be changed"
              />

              <FormInput
                label="Phone"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+1234567890"
              />

              <FormInput
                label="University"
                {...register('university')}
                error={errors.university?.message}
                placeholder="Stanford University"
              />

              <FormInput
                label="Student ID"
                {...register('studentId')}
                error={errors.studentId?.message}
                placeholder="STU123456"
              />

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
