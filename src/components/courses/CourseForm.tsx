import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { X, Upload, ImageIcon } from 'lucide-react';
import type { Course, CreateCourseDto } from '@/types/course.types';

const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  description: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  level: z.string().optional(),
  duration: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
  hourlyRate: z.coerce.number().min(0, 'Rate must be positive'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CreateCourseDto & { flyer?: File; images?: File[] }) => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string>(course?.flyer || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    course?.images?.map((img) => img.imageUrl) || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ? {
      name: course.name,
      description: course.description || '',
      subject: course.subject,
      level: course.level || '',
      duration: course.duration,
      hourlyRate: course.hourlyRate,
    } : {
      duration: 60,
      hourlyRate: 50,
    },
  });

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFlyerFile(file);
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      alert('You can upload a maximum of 10 images');
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Each file size must be less than 5MB');
        return;
      }
    }

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeFlyerPreview = () => {
    setFlyerFile(null);
    setFlyerPreview('');
  };

  const removeImagePreview = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: CourseFormData) => {
    onSubmit({
      ...data,
      flyer: flyerFile || undefined,
      images: imageFiles.length > 0 ? imageFiles : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormInput
        label="Course Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Introduction to React"
      />

      <FormTextarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="A comprehensive course covering..."
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Subject"
          {...register('subject')}
          error={errors.subject?.message}
          placeholder="Computer Science"
        />

        <FormInput
          label="Level"
          {...register('level')}
          error={errors.level?.message}
          placeholder="Beginner, Intermediate, Advanced"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Duration (minutes)"
          type="number"
          {...register('duration')}
          error={errors.duration?.message}
          placeholder="60"
        />

        <FormInput
          label="Hourly Rate ($)"
          type="number"
          {...register('hourlyRate')}
          error={errors.hourlyRate?.message}
          placeholder="50"
        />
      </div>

      {/* Flyer Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Course Flyer (Optional)
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="flyer-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Upload Flyer
          </label>
          <input
            id="flyer-upload"
            type="file"
            accept="image/*"
            onChange={handleFlyerChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500">Max 5MB</span>
        </div>
        {flyerPreview && (
          <div className="relative w-48 h-32 mt-2">
            <img
              src={flyerPreview}
              alt="Flyer preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={removeFlyerPreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Additional Images Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Additional Images (Optional)
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="images-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Images
          </label>
          <input
            id="images-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500">Max 10 images, 5MB each</span>
        </div>
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-full h-24">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImagePreview(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {course ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
