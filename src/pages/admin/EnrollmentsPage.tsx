import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { adminApi } from '@/api/admin.api';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { FormSelect } from '@/components/common/FormSelect';
import { format } from 'date-fns';

export default function AdminEnrollmentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ['admin', 'enrollments', page, statusFilter],
    queryFn: () => adminApi.getAllEnrollments(page, 20, statusFilter === 'ALL' ? undefined : statusFilter),
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
      header: 'Lecturer',
      accessor: ((row: any) => {
        const lecturer = row.course?.lecturer;
        return lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'N/A';
      }) as any,
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
      header: 'Approved',
      accessor: 'approvedAt' as any,
      cell: (value: string | null) => value ? format(new Date(value), 'MMM d, yyyy') : '-',
    },
  ];

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">Monitor all course enrollments</p>
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
          data={enrollmentsData?.data || []}
          columns={columns}
          currentPage={page}
          totalPages={enrollmentsData?.totalPages || 1}
          onPageChange={setPage}
          emptyMessage="No enrollments found"
        />
      </div>
    </DashboardLayout>
  );
}
