import { EnrollmentStatus } from './student.types';

export interface EnrollmentDetails {
  id: string;
  status: EnrollmentStatus;
  requestedAt: string;
  approvedAt?: string;
  studentId?: string;
  studentGroupId?: string;
  course: {
    id: string;
    name: string;
    subject: string;
    level?: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    university?: string;
    studentId?: string;
    email: string;
  };
  studentGroup?: {
    id: string;
    name: string;
  };
}

export interface UpdateEnrollmentStatusDto {
  status: 'APPROVED' | 'REJECTED';
}
