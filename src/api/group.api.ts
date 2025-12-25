import { apiClient } from './client';
import type {
  StudentGroup,
  CreateGroupDto,
  UpdateGroupDto,
  GroupDetails,
  DetailedGroupInfo,
  PendingGroupRequest
} from '@/types/group.types';
import type { PaginatedResponse } from '@/types/common.types';

export const groupApi = {
  createGroup: async (data: CreateGroupDto): Promise<StudentGroup> => {
    const response = await apiClient.post<StudentGroup>('/groups', data);
    return response.data;
  },

  getAllGroups: async (page = 1, limit = 20): Promise<PaginatedResponse<StudentGroup>> => {
    const response = await apiClient.get<PaginatedResponse<StudentGroup>>('/groups', {
      params: { page, limit },
    });
    return response.data;
  },

  getMyGroups: async (): Promise<StudentGroup[]> => {
    const response = await apiClient.get<StudentGroup[]>('/groups/my-groups');
    return response.data;
  },

  getJoinedGroups: async (): Promise<StudentGroup[]> => {
    const response = await apiClient.get<StudentGroup[]>('/groups/joined');
    return response.data;
  },

  getGroupById: async (groupId: string): Promise<GroupDetails> => {
    const response = await apiClient.get<GroupDetails>(`/groups/${groupId}`);
    return response.data;
  },

  // Get detailed group information for modal display
  getGroupDetails: async (groupId: string): Promise<DetailedGroupInfo> => {
    const response = await apiClient.get<DetailedGroupInfo>(`/groups/${groupId}/details`);
    return response.data;
  },

  // Search for a group by group code
  searchByGroupCode: async (groupCode: string): Promise<StudentGroup> => {
    const response = await apiClient.get<StudentGroup>(`/groups/search/${groupCode}`);
    return response.data;
  },

  // Join a group using group code
  joinGroupByCode: async (groupCode: string): Promise<void> => {
    await apiClient.post(`/groups/join/${groupCode}`);
  },

  // Get pending join requests for my groups
  getPendingJoinRequests: async (): Promise<PendingGroupRequest[]> => {
    const response = await apiClient.get<PendingGroupRequest[]>('/groups/pending-requests');
    return response.data;
  },

  // Approve a join request
  approveJoinRequest: async (enrollmentId: string): Promise<void> => {
    await apiClient.post(`/groups/requests/${enrollmentId}/approve`);
  },

  // Reject a join request
  rejectJoinRequest: async (enrollmentId: string): Promise<void> => {
    await apiClient.post(`/groups/requests/${enrollmentId}/reject`);
  },

  // Remove a member from group (group owner only)
  removeMember: async (enrollmentId: string): Promise<void> => {
    await apiClient.delete(`/groups/members/${enrollmentId}`);
  },

  joinGroup: async (groupId: string): Promise<void> => {
    await apiClient.post(`/groups/${groupId}/join`);
  },

  updateGroup: async (groupId: string, data: UpdateGroupDto): Promise<StudentGroup> => {
    const response = await apiClient.put<StudentGroup>(`/groups/${groupId}`, data);
    return response.data;
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}`);
  },
};
