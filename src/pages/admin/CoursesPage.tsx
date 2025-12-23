import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { adminApi } from '@/api/admin.api';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['admin', 'courses', page],
    queryFn: () => adminApi.getAllCourses(page, 20),
  });

  const columns = [
    {
      header: 'Course Name',
      accessor: 'name' as any,
    },
    {
      header: 'Subject',
      accessor: 'subject' as any,
    },
    {
      header: 'Level',
      accessor: 'level' as any,
      cell: (value: string) => value || 'N/A',
    },
    {
      header: 'Lecturer',
      accessor: ((row: any) => {
        const lecturer = row.lecturer;
        return lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'N/A';
      }) as any,
    },
    {
      header: 'Duration',
      accessor: 'duration' as any,
      cell: (value: number) => `${value} min`,
    },
    {
      header: 'Rate',
      accessor: 'hourlyRate' as any,
      cell: (value: number) => `$${value}/hr`,
    },
    {
      header: 'Status',
      accessor: 'isActive' as any,
      cell: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Oversight</h1>
          <p className="text-muted-foreground">Monitor all courses in the system</p>
        </div>

        <DataTable
          data={coursesData?.data || []}
          columns={columns}
          currentPage={page}
          totalPages={coursesData?.totalPages || 1}
          onPageChange={setPage}
          emptyMessage="No courses found"
        />
      </div>
    </DashboardLayout>
  );
}
