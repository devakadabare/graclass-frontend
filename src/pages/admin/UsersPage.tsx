import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { adminApi } from '@/api/admin.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSelect } from '@/components/common/FormSelect';
import { UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, roleFilter],
    queryFn: () => adminApi.getUsers(page, 20, roleFilter === 'ALL' ? undefined : roleFilter),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user status');
    },
  });

  const columns = [
    {
      header: 'Email',
      accessor: 'email' as const,
    },
    {
      header: 'Role',
      accessor: 'role' as const,
      cell: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive' as const,
      cell: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Email Verified',
      accessor: 'isEmailVerified' as const,
      cell: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Verified' : 'Not Verified'}
        </Badge>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt' as const,
      cell: (value: string) => format(new Date(value), 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      accessor: ((row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStatusMutation.mutate({
            userId: row.id,
            isActive: !row.isActive,
          })}
        >
          {row.isActive ? (
            <UserX className="h-4 w-4 text-destructive" />
          ) : (
            <UserCheck className="h-4 w-4 text-green-600" />
          )}
        </Button>
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their access</p>
        </div>

        <div className="max-w-xs">
          <FormSelect
            label="Filter by Role"
            placeholder="All Roles"
            value={roleFilter}
            onValueChange={setRoleFilter}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'LECTURER', label: 'Lecturers' },
              { value: 'STUDENT', label: 'Students' },
              { value: 'ADMIN', label: 'Admins' },
            ]}
          />
        </div>

        <DataTable
          data={usersData?.data || []}
          columns={columns}
          currentPage={page}
          totalPages={usersData?.totalPages || 1}
          onPageChange={setPage}
          emptyMessage="No users found"
        />
      </div>
    </DashboardLayout>
  );
}
