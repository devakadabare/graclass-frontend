import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { groupApi } from '@/api/group.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupForm } from '@/components/groups/GroupForm';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function StudentGroupsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: myGroups, isLoading: loadingMyGroups } = useQuery({
    queryKey: ['groups', 'my-groups'],
    queryFn: () => groupApi.getMyGroups(),
  });

  const { data: joinedGroups, isLoading: loadingJoined } = useQuery({
    queryKey: ['groups', 'joined'],
    queryFn: () => groupApi.getJoinedGroups(),
  });

  const { data: allGroups, isLoading: loadingAll } = useQuery({
    queryKey: ['groups', 'all'],
    queryFn: () => groupApi.getAllGroups(),
  });

  const joinMutation = useMutation({
    mutationFn: (groupId: string) => groupApi.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Join request sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join group');
    },
  });

  const myGroupsColumns = [
    {
      header: 'Group Name',
      accessor: 'name' as any,
    },
    {
      header: 'Description',
      accessor: 'description' as any,
      cell: (value: string) => value || '-',
    },
    {
      header: 'Members',
      accessor: 'memberCount' as any,
      cell: (value: number) => (
        <Badge variant="secondary">
          <Users className="h-3 w-3 mr-1" />
          {value || 0}
        </Badge>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt' as any,
      cell: (value: string) => format(new Date(value), 'MMM d, yyyy'),
    },
  ];

  const browseColumns = [
    {
      header: 'Group Name',
      accessor: 'name' as any,
    },
    {
      header: 'Description',
      accessor: 'description' as any,
      cell: (value: string) => value || '-',
    },
    {
      header: 'Creator',
      accessor: ((row: any) => {
        const creator = row.creator;
        return creator ? `${creator.firstName} ${creator.lastName}` : 'N/A';
      }) as any,
    },
    {
      header: 'Members',
      accessor: 'memberCount' as any,
      cell: (value: number) => (
        <Badge variant="secondary">
          <Users className="h-3 w-3 mr-1" />
          {value || 0}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: ((row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => joinMutation.mutate(row.id)}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      )) as any,
    },
  ];

  if (loadingMyGroups || loadingJoined || loadingAll) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Study Groups</h1>
            <p className="text-muted-foreground">Collaborate with other students</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        <Tabs defaultValue="my-groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="joined">Joined Groups</TabsTrigger>
            <TabsTrigger value="browse">Browse Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups">
            <DataTable
              data={myGroups || []}
              columns={myGroupsColumns}
              emptyMessage="You haven't created any groups yet."
            />
          </TabsContent>

          <TabsContent value="joined">
            <DataTable
              data={joinedGroups || []}
              columns={myGroupsColumns}
              emptyMessage="You haven't joined any groups yet."
            />
          </TabsContent>

          <TabsContent value="browse">
            <DataTable
              data={allGroups?.data || []}
              columns={browseColumns}
              emptyMessage="No groups available to join."
            />
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
              <DialogDescription>
                Create a new study group to collaborate with others
              </DialogDescription>
            </DialogHeader>
            <GroupForm
              onSuccess={() => {
                setShowCreateDialog(false);
                queryClient.invalidateQueries({ queryKey: ['groups'] });
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
