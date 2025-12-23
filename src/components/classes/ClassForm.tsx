import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import { Button } from '@/components/ui/button';
import { classApi } from '@/api/class.api';
import { courseApi } from '@/api/course.api';
import { enrollmentApi } from '@/api/enrollment.api';
import { toast } from 'sonner';
import type { Class, ClassWithDetails, CreateClassDto } from '@/types/class.types';
import { EnrollmentStatus } from '@/types/student.types';

const classSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  enrollmentId: z.string().min(1, 'Student/Group is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  meetingLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  classData?: Class | ClassWithDetails;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClassForm({ classData, onSuccess, onCancel }: ClassFormProps) {
  const { data: courses } = useQuery({
    queryKey: ['courses', 'my-courses'],
    queryFn: () => courseApi.getMyCourses(),
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
      enrollmentId: '',
      date: classData.date.split('T')[0],
      startTime: classData.startTime,
      endTime: classData.endTime,
      meetingLink: classData.meetingLink || '',
      location: classData.location || '',
    } : {},
  });

  const courseId = watch('courseId');
  const enrollmentId = watch('enrollmentId');

  // Fetch enrollments for selected course
  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', courseId],
    queryFn: () => enrollmentApi.getEnrollments(EnrollmentStatus.APPROVED, courseId),
    enabled: !!courseId,
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

  const onSubmit = (data: ClassFormData) => {
    let studentId: string | undefined;
    let studentGroupId: string | undefined;

    if (classData) {
      // When editing, use existing studentId/studentGroupId from classData
      studentId = classData.studentId;
      studentGroupId = classData.studentGroupId;
    } else {
      // When creating, find the selected enrollment to get studentId or studentGroupId
      const selectedEnrollment = enrollments?.find(e => e.id === data.enrollmentId);

      if (!selectedEnrollment) {
        toast.error('Please select a valid student/group');
        return;
      }

      // Extract studentId or studentGroupId from enrollment
      // Try direct fields first, fallback to nested object IDs
      studentId = selectedEnrollment.studentId || selectedEnrollment.student?.id;
      studentGroupId = selectedEnrollment.studentGroupId || selectedEnrollment.studentGroup?.id;
    }

    const payload = {
      courseId: data.courseId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      meetingLink: data.meetingLink || undefined,
      location: data.location || undefined,
      studentId: studentId || undefined,
      studentGroupId: studentGroupId || undefined,
    };

    if (classData) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as CreateClassDto);
    }
  };

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

      <FormSelect
        label="Student/Group"
        placeholder="Select student or group"
        value={enrollmentId}
        onValueChange={(value) => setValue('enrollmentId', value)}
        options={enrollments?.map(e => ({
          value: e.id,
          label: e.student
            ? `${e.student.firstName} ${e.student.lastName}`
            : e.studentGroup?.name || 'Unknown'
        })) || []}
        error={errors.enrollmentId?.message}
        disabled={!courseId}
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
