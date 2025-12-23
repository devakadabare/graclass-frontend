import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
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
  onSubmit: (data: CreateCourseDto) => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
