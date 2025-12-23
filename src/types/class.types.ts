export enum ClassStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Class {
  id: string;
  courseId: string;
  lecturerId: string;
  studentId?: string;
  studentGroupId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  meetingLink?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  courseId: string;
  studentId?: string;
  studentGroupId?: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  location?: string;
}

export interface UpdateClassDto {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: ClassStatus;
  meetingLink?: string;
  location?: string;
}

export interface ClassWithDetails {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  meetingLink?: string;
  location?: string;
  course: {
    name: string;
    subject: string;
    level?: string;
    duration?: number;
  };
  lecturer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  studentGroup?: {
    id: string;
    name: string;
  };
}
