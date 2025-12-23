import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useLecturerProfile } from '@/hooks/useLecturerProfile';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  qualifications: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function LecturerProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useLecturerProfile();

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
      bio: profile.bio || '',
      qualifications: profile.qualifications || '',
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
          <p className="text-muted-foreground">Manage your lecturer profile information</p>
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

              <FormTextarea
                label="Bio"
                {...register('bio')}
                error={errors.bio?.message}
                placeholder="Tell students about yourself..."
                rows={4}
              />

              <FormTextarea
                label="Qualifications"
                {...register('qualifications')}
                error={errors.qualifications?.message}
                placeholder="PhD in Computer Science, MSc in Software Engineering..."
                rows={3}
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
