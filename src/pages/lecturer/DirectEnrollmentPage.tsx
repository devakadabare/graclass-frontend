import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSelect } from '@/components/common/FormSelect';
import { Button } from '@/components/ui/button';
import { lecturerApi } from '@/api/lecturer.api';
import { courseApi } from '@/api/course.api';
import { studentApi } from '@/api/student.api';
import { groupApi } from '@/api/group.api';
import { toast } from 'sonner';
import { UserCheck } from 'lucide-react';

const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  enrollmentType: z.enum(['student', 'group'], { required_error: 'Enrollment type is required' }),
  studentId: z.string().optional(),
  studentGroupId: z.string().optional(),
}).refine(
  (data) => {
    if (data.enrollmentType === 'student') {
      return !!data.studentId;
    } else {
      return !!data.studentGroupId;
    }
  },
  {
    message: 'Please select a student or group',
    path: ['studentId'],
  }
);

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export function DirectEnrollmentPage() {
  const queryClient = useQueryClient();

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      enrollmentType: 'student',
    },
  });

  const courseId = watch('courseId');
  const enrollmentType = watch('enrollmentType');
  const studentId = watch('studentId');
  const studentGroupId = watch('studentGroupId');

  // Fetch lecturer's courses
  const { data: courses } = useQuery({
    queryKey: ['courses', 'my-courses'],
    queryFn: () => courseApi.getMyCourses(),
  });

  // Fetch all students
  const { data: studentsData } = useQuery({
    queryKey: ['students', 'all'],
    queryFn: () => studentApi.getAllStudents(),
    enabled: enrollmentType === 'student',
  });

  // Fetch all student groups
  const { data: groupsData } = useQuery({
    queryKey: ['student-groups', 'all'],
    queryFn: () => groupApi.getAllGroups(),
    enabled: enrollmentType === 'group',
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: (data: { courseId: string; studentId?: string; studentGroupId?: string }) =>
      lecturerApi.createEnrollment(data),
    onSuccess: (data) => {
      const entityName = data.student
        ? `${data.student.firstName} ${data.student.lastName}`
        : data.studentGroup?.name || 'Unknown';
      toast.success(`Successfully enrolled ${entityName} in ${data.course.name}`);
      reset();
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create enrollment');
    },
  });

  const onSubmit = (data: EnrollmentFormData) => {
    const payload: { courseId: string; studentId?: string; studentGroupId?: string } = {
      courseId: data.courseId,
    };

    if (data.enrollmentType === 'student') {
      payload.studentId = data.studentId;
    } else {
      payload.studentGroupId = data.studentGroupId;
    }

    createEnrollmentMutation.mutate(payload);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Direct Enrollment</h1>
          <p className="text-muted-foreground">
            Enroll students or groups directly into your courses
          </p>
        </div>

        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Enrollment Details
          </CardTitle>
          <CardDescription>
            Select a course and student/group to create an enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              label="Course"
              placeholder="Select a course"
              value={courseId}
              onValueChange={(value) => setValue('courseId', value)}
              options={courses?.map(c => ({ value: c.id, label: `${c.name} (${c.subject})` })) || []}
              error={errors.courseId?.message}
            />

            <FormSelect
              label="Enrollment Type"
              placeholder="Select enrollment type"
              value={enrollmentType}
              onValueChange={(value) => {
                setValue('enrollmentType', value as 'student' | 'group');
                setValue('studentId', undefined);
                setValue('studentGroupId', undefined);
              }}
              options={[
                { value: 'student', label: 'Individual Student' },
                { value: 'group', label: 'Student Group' },
              ]}
              error={errors.enrollmentType?.message}
            />

            {enrollmentType === 'student' ? (
              <FormSelect
                label="Student"
                placeholder="Select a student"
                value={studentId}
                onValueChange={(value) => setValue('studentId', value)}
                options={studentsData?.data?.map(s => ({
                  value: s.id,
                  label: `${s.firstName} ${s.lastName} (${s.email})`
                })) || []}
                error={errors.studentId?.message}
              />
            ) : (
              <FormSelect
                label="Student Group"
                placeholder="Select a group"
                value={studentGroupId}
                onValueChange={(value) => setValue('studentGroupId', value)}
                options={groupsData?.data?.map(g => ({
                  value: g.id,
                  label: `${g.name} (${g.memberCount || 0} members)`
                })) || []}
                error={errors.studentGroupId?.message}
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={createEnrollmentMutation.isPending}
              >
                Clear Form
              </Button>
              <Button type="submit" disabled={createEnrollmentMutation.isPending}>
                {createEnrollmentMutation.isPending ? 'Enrolling...' : 'Create Enrollment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
