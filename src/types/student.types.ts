export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  studentId?: string;
  profileImage?: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  university?: string;
  studentId?: string;
}

export interface EnrollCourseDto {
  courseId: string;
  studentGroupId?: string;
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentGroupId?: string;
  status: EnrollmentStatus;
  requestedAt: string;
  approvedAt?: string;
  course: {
    id: string;
    name: string;
    subject: string;
    level?: string;
    duration?: number;
    hourlyRate?: number;
    lecturer: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface StudentClass {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink?: string;
  location?: string;
  course: {
    name: string;
    subject: string;
  };
  lecturer: {
    firstName: string;
    lastName: string;
  };
}
