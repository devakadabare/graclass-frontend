import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { studentApi } from '@/api/student.api';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentClassesPage() {
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { data: classes, isLoading } = useQuery({
    queryKey: ['student', 'classes', showUpcoming],
    queryFn: () => studentApi.getClasses(showUpcoming),
  });

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as any,
      cell: (value: string) => format(new Date(value), 'MMM d, yyyy'),
    },
    {
      header: 'Time',
      accessor: ((row: any) => `${row.startTime} - ${row.endTime}`) as any,
    },
    {
      header: 'Course',
      accessor: ((row: any) => row.course?.name || 'N/A') as any,
    },
    {
      header: 'Subject',
      accessor: ((row: any) => row.course?.subject || 'N/A') as any,
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
          value === 'SCHEDULED' ? 'default' :
          value === 'COMPLETED' ? 'secondary' :
          'destructive'
        }>
          {value}
        </Badge>
      ),
    },
    {
      header: 'Meeting',
      accessor: ((row: any) => (
        row.meetingLink ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={row.meetingLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">
            {row.location || 'TBD'}
          </span>
        )
      )) as any,
    },
  ];

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Classes</h1>
            <p className="text-muted-foreground">View your class schedule</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showUpcoming ? 'default' : 'outline'}
              onClick={() => setShowUpcoming(true)}
            >
              Upcoming
            </Button>
            <Button
              variant={!showUpcoming ? 'default' : 'outline'}
              onClick={() => setShowUpcoming(false)}
            >
              All Classes
            </Button>
          </div>
        </div>

        <DataTable
          data={classes || []}
          columns={columns}
          emptyMessage={
            showUpcoming
              ? "No upcoming classes scheduled."
              : "No classes found."
          }
        />
      </div>
    </DashboardLayout>
  );
}
