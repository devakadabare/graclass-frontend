import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useLecturerProfile } from '@/hooks/useLecturerProfile';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropDialog } from '@/components/common/ImageCropDialog';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  qualifications: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function LecturerProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);

  // Clear local preview after successful update
  const handleUpdateSuccess = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const { profile, isLoading, updateProfile, isUpdating } = useLecturerProfile(handleUpdateSuccess);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Open crop dialog
      setTempImageUrl(URL.createObjectURL(file));
      setShowCropDialog(true);
    }
    // Reset input
    e.target.value = '';
  };

  const handleCropComplete = (croppedFile: File) => {
    setSelectedFile(croppedFile);
    setPreviewUrl(URL.createObjectURL(croppedFile));
    setShowCropDialog(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  const handleCropCancel = () => {
    setShowCropDialog(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, selectedFile || undefined);
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  };

  const currentImageUrl = previewUrl || profile?.profileImage;

  console.log('=== PROFILE PAGE RENDER ===');
  console.log('Preview URL:', previewUrl);
  console.log('Profile Image:', profile?.profileImage);
  console.log('Current Image URL:', currentImageUrl);
  console.log('===========================');

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

        {/* Image Crop Dialog */}
        {tempImageUrl && (
          <ImageCropDialog
            open={showCropDialog}
            imageUrl={tempImageUrl}
            onClose={handleCropCancel}
            onCropComplete={handleCropComplete}
            aspectRatio={1}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={currentImageUrl || undefined} alt="Profile" />
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-image')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {currentImageUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

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
