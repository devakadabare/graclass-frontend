export interface StudentGroup {
  id: string;
  name: string;
  description?: string;
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
