import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import { Button } from '@/components/ui/button';
import { classApi } from '@/api/class.api';
import { courseApi } from '@/api/course.api';
import { toast } from 'sonner';
import type { Class, CreateClassDto } from '@/types/class.types';

const classSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  meetingLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  classData?: Class;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClassForm({ classData, onSuccess, onCancel }: ClassFormProps) {
  const { data: courses } = useQuery({
    queryKey: ['courses', 'my-courses'],
    queryFn: () => courseApi.getMyCourses(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateClassDto) => classApi.createClass(data),
    onSuccess: () => {
      toast.success('Class scheduled successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule class');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => classApi.updateClass(classData!.id, data),
    onSuccess: () => {
      toast.success('Class updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update class');
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: classData ? {
      courseId: classData.courseId,
      date: classData.date.split('T')[0],
      startTime: classData.startTime,
      endTime: classData.endTime,
      meetingLink: classData.meetingLink || '',
      location: classData.location || '',
    } : {},
  });

  const onSubmit = (data: ClassFormData) => {
    const payload = {
      ...data,
      meetingLink: data.meetingLink || undefined,
      location: data.location || undefined,
    };

    if (classData) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as CreateClassDto);
    }
  };

  const courseId = watch('courseId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSelect
        label="Course"
        placeholder="Select a course"
        value={courseId}
        onValueChange={(value) => setValue('courseId', value)}
        options={courses?.map(c => ({ value: c.id, label: c.name })) || []}
        error={errors.courseId?.message}
      />

      <FormInput
        label="Date"
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Start Time"
          type="time"
          {...register('startTime')}
          error={errors.startTime?.message}
        />

        <FormInput
          label="End Time"
          type="time"
          {...register('endTime')}
          error={errors.endTime?.message}
        />
      </div>

      <FormInput
        label="Meeting Link (Optional)"
        type="url"
        {...register('meetingLink')}
        error={errors.meetingLink?.message}
        placeholder="https://meet.google.com/..."
      />

      <FormInput
        label="Location (Optional)"
        {...register('location')}
        error={errors.location?.message}
        placeholder="Room 101, Building A"
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : classData ? 'Update Class' : 'Schedule Class'}
        </Button>
      </div>
    </form>
  );
}
