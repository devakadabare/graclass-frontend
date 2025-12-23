/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { classApi } from '@/api/class.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, X, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClassForm } from '@/components/classes/ClassForm';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { ClassWithDetails } from '@/types/class.types';

export default function LecturerClassesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassWithDetails | null>(null);
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['lecturer', 'classes'],
    queryFn: () => classApi.getMyClasses(),
  });

  const cancelMutation = useMutation({
    mutationFn: (classId: string) => classApi.cancelClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'classes'] });
      toast.success('Class cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel class');
    },
  });

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as keyof ClassWithDetails,
      cell: (value: string) => format(new Date(value), 'MMM d, yyyy'),
    },
    {
      header: 'Time',
      accessor: ((row: ClassWithDetails) => `${row.startTime} - ${row.endTime}`) as any,
    },
    {
      header: 'Course',
      accessor: ((row: ClassWithDetails) => row.course?.name || 'N/A') as any,
    },
    {
      header: 'Student',
      accessor: ((row: ClassWithDetails) => {
        if (row.student) {
          return `${row.student.firstName} ${row.student.lastName}`;
        }
        if (row.studentGroup) {
          return row.studentGroup.name + ' (Group)';
        }
        return 'N/A';
      }) as any,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof ClassWithDetails,
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
      header: 'Actions',
      accessor: ((row: ClassWithDetails) => (
        <div className="flex gap-2">
          {row.status === 'SCHEDULED' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingClass(row)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelMutation.mutate(row.id)}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
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
            <p className="text-muted-foreground">Manage your scheduled classes</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Class
          </Button>
        </div>

        <DataTable
          data={classes || []}
          columns={columns}
          emptyMessage="No classes scheduled. Create your first class to get started."
        />

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Class</DialogTitle>
              <DialogDescription>
                Create a new class session
              </DialogDescription>
            </DialogHeader>
            <ClassForm
              onSuccess={() => {
                setShowCreateDialog(false);
                queryClient.invalidateQueries({ queryKey: ['lecturer', 'classes'] });
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>
                Update class information
              </DialogDescription>
            </DialogHeader>
            {editingClass && (
              <ClassForm
                classData={editingClass}
                onSuccess={() => {
                  setEditingClass(null);
                  queryClient.invalidateQueries({ queryKey: ['lecturer', 'classes'] });
                }}
                onCancel={() => setEditingClass(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
