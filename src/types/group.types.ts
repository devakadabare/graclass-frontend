export interface StudentGroup {
  id: string;
  name: string;
  description?: string;
  groupCode?: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    firstName: string;
    lastName: string;
    user?: {
      email: string;
    };
  };
  memberCount?: number;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface GroupMember {
  id: string;
  studentId: string;
  groupId: string;
  status: string;
  student: {
    firstName: string;
    lastName: string;
  };
}

export interface GroupDetails extends StudentGroup {
  enrollments: GroupMember[];
}

// New detailed types for the group details modal
export interface DetailedGroupMember {
  enrollmentId: string;
  joinedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    university?: string;
    studentId?: string;
    profileImage?: string;
    email: string;
  };
}

export interface PendingGroupRequest {
  enrollmentId: string;
  requestedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    university?: string;
    studentId?: string;
    profileImage?: string;
    email: string;
  };
}

export interface EnrolledCourse {
  id: string;
  name: string;
  subject: string;
  enrolledAt: string;
}

export interface DetailedGroupInfo {
  id: string;
  name: string;
  description?: string;
  groupCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    university?: string;
    studentId?: string;
    email: string;
  };
  isCreator: boolean;
  isMember: boolean;
  membershipStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  stats: {
    totalMembers: number;
    pendingRequests: number;
    enrolledCourses: number;
  };
  members: DetailedGroupMember[];
  pendingRequests: PendingGroupRequest[];
  enrolledCourses: EnrolledCourse[];
}
