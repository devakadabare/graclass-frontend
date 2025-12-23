import { apiClient } from './client';
import type { StudentGroup, CreateGroupDto, UpdateGroupDto, GroupDetails } from '@/types/group.types';
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
