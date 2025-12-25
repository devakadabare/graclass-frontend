import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi } from '@/api/group.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  Calendar,
  Copy,
  Check,
  X,
  Clock,
  Mail,
  GraduationCap,
  UserMinus
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface GroupDetailsModalProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailsModal({ groupId, open, onOpenChange }: GroupDetailsModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const queryClient = useQueryClient();

  // Fetch group details
  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group-details', groupId],
    queryFn: () => groupApi.getGroupDetails(groupId),
    enabled: open && !!groupId,
  });

  // Approve join request mutation
  const approveMutation = useMutation({
    mutationFn: (enrollmentId: string) => groupApi.approveJoinRequest(enrollmentId),
    onSuccess: () => {
      toast.success('Join request approved successfully');
      queryClient.invalidateQueries({ queryKey: ['group-details', groupId] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    },
    onError: () => {
      toast.error('Failed to approve join request');
    },
  });

  // Reject join request mutation
  const rejectMutation = useMutation({
    mutationFn: (enrollmentId: string) => groupApi.rejectJoinRequest(enrollmentId),
    onSuccess: () => {
      toast.success('Join request rejected');
      queryClient.invalidateQueries({ queryKey: ['group-details', groupId] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    },
    onError: () => {
      toast.error('Failed to reject join request');
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (enrollmentId: string) => groupApi.removeMember(enrollmentId),
    onSuccess: () => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: ['group-details', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => {
      toast.error('Failed to remove member');
    },
  });

  const copyGroupCode = () => {
    if (group?.groupCode) {
      navigator.clipboard.writeText(group.groupCode);
      setCopiedCode(true);
      toast.success('Group code copied to clipboard');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !group) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8 text-destructive">
            Failed to load group details
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{group.name}</DialogTitle>
          <DialogDescription>{group.description}</DialogDescription>
        </DialogHeader>

        {/* Group Code Section */}
        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Group Code</p>
            <p className="text-2xl font-mono font-bold">{group.groupCode}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyGroupCode}
            className="gap-2"
          >
            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{group.stats.totalMembers}</div>
            </CardContent>
          </Card>

          {group.isCreator && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{group.stats.pendingRequests}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{group.stats.enrolledCourses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Creator Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Group Owner</h3>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Avatar>
              <AvatarImage src={undefined} />
              <AvatarFallback>
                {getInitials(group.creator.firstName, group.creator.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">
                {group.creator.firstName} {group.creator.lastName}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {group.creator.email}
              </p>
            </div>
            {group.isCreator && <Badge>You</Badge>}
          </div>
        </div>

        <Separator />

        {/* Tabs for Members, Pending Requests, and Courses */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">
              Members ({group.stats.totalMembers})
            </TabsTrigger>
            {group.isCreator && (
              <TabsTrigger value="pending">
                Pending ({group.stats.pendingRequests})
              </TabsTrigger>
            )}
            <TabsTrigger value="courses">
              Courses ({group.stats.enrolledCourses})
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-3 mt-4">
            {group.members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members yet
              </div>
            ) : (
              group.members.map((member) => (
                <div
                  key={member.enrollmentId}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={member.student.profileImage} />
                    <AvatarFallback>
                      {getInitials(member.student.firstName, member.student.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.student.firstName} {member.student.lastName}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {member.student.university && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {member.student.university}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  {group.isCreator && member.student.id !== group.creator.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Remove ${member.student.firstName} ${member.student.lastName} from the group?`)) {
                          removeMemberMutation.mutate(member.enrollmentId);
                        }
                      }}
                      disabled={removeMemberMutation.isPending}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {/* Pending Requests Tab (only for group owner) */}
          {group.isCreator && (
            <TabsContent value="pending" className="space-y-3 mt-4">
              {group.pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests
                </div>
              ) : (
                group.pendingRequests.map((request) => (
                  <div
                    key={request.enrollmentId}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Avatar>
                      <AvatarImage src={request.student.profileImage} />
                      <AvatarFallback>
                        {getInitials(request.student.firstName, request.student.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {request.student.firstName} {request.student.lastName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {request.student.university && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {request.student.university}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(request.requestedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => approveMutation.mutate(request.enrollmentId)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(request.enrollmentId)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          )}

          {/* Enrolled Courses Tab */}
          <TabsContent value="courses" className="space-y-3 mt-4">
            {group.enrolledCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Not enrolled in any courses yet
              </div>
            ) : (
              group.enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{course.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{course.subject}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Enrolled {format(new Date(course.enrolledAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
