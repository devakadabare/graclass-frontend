/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { enrollmentApi } from '@/api/enrollment.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSelect } from '@/components/common/FormSelect';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function LecturerEnrollmentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['lecturer', 'enrollments', statusFilter],
    queryFn: () => enrollmentApi.getEnrollments(statusFilter === 'ALL' ? undefined : statusFilter as any),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
      enrollmentApi.updateEnrollmentStatus(id, {status}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'enrollments'] });
      toast.success('Enrollment status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update enrollment status');
    },
  });

  const columns = [
    {
      header: 'Student',
      accessor: ((row: any) => {
        if (row.student) {
          return `${row.student.firstName} ${row.student.lastName}`;
        }
        if (row.studentGroup) {
          return `${row.studentGroup.name} (Group)`;
        }
        return 'N/A';
      }) as any,
    },
    {
      header: 'Course',
      accessor: ((row: any) => row.course?.name || 'N/A') as any,
    },
    {
      header: 'Status',
      accessor: 'status' as any,
      cell: (value: string) => (
        <Badge variant={
          value === 'APPROVED' ? 'default' :
          value === 'REJECTED' ? 'destructive' :
          'secondary'
        }>
          {value}
        </Badge>
      ),
    },
    {
      header: 'Requested',
      accessor: 'requestedAt' as any,
      cell: (value: string) => format(new Date(value), 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      accessor: ((row: any) => (
        row.status === 'PENDING' ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'APPROVED' })}
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'REJECTED' })}
            >
              <XCircle className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : null
      )) as any,
    },
  ];

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Enrollments</h1>
          <p className="text-muted-foreground">Manage student enrollment requests</p>
        </div>

        <div className="max-w-xs">
          <FormSelect
            label="Filter by Status"
            placeholder="All Statuses"
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
        </div>

        <DataTable
          data={enrollments || []}
          columns={columns}
          emptyMessage="No enrollment requests found"
        />
      </div>
    </DashboardLayout>
  );
}
