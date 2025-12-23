import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { availabilityApi } from '@/api/availability.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AvailabilityForm } from '@/components/availability/AvailabilityForm';
import { toast } from 'sonner';
import type { Availability } from '@/types/availability.types';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LecturerAvailabilityPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: availability, isLoading } = useQuery({
    queryKey: ['lecturer', 'availability'],
    queryFn: () => availabilityApi.getMyAvailability(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => availabilityApi.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'availability'] });
      toast.success('Availability deleted successfully');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Failed to delete availability');
    },
  });

  const columns = [
    {
      header: 'Day of Week',
      accessor: 'dayOfWeek' as keyof Availability,
      cell: (value: number) => DAYS_OF_WEEK[value] || 'N/A',
    },
    {
      header: 'Start Time',
      accessor: 'startTime' as keyof Availability,
    },
    {
      header: 'End Time',
      accessor: 'endTime' as keyof Availability,
    },
    {
      header: 'Status',
      accessor: 'isRecurring' as keyof Availability,
      cell: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Recurring' : 'One-time'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: ((row: Availability) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingAvailability(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingId(row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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
            <h1 className="text-3xl font-bold">Availability</h1>
            <p className="text-muted-foreground">Manage your weekly availability schedule</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        </div>

        <DataTable
          data={availability || []}
          columns={columns}
          emptyMessage="No availability set. Add your available time slots."
        />

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set your available time slots
              </DialogDescription>
            </DialogHeader>
            <AvailabilityForm
              onSuccess={() => {
                setShowCreateDialog(false);
                queryClient.invalidateQueries({ queryKey: ['lecturer', 'availability'] });
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingAvailability} onOpenChange={() => setEditingAvailability(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Availability</DialogTitle>
              <DialogDescription>
                Update your availability
              </DialogDescription>
            </DialogHeader>
            {editingAvailability && (
              <AvailabilityForm
                availability={editingAvailability}
                onSuccess={() => {
                  setEditingAvailability(null);
                  queryClient.invalidateQueries({ queryKey: ['lecturer', 'availability'] });
                }}
                onCancel={() => setEditingAvailability(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this availability slot.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
