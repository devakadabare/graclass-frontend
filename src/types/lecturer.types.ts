export interface LecturerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  qualifications?: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLecturerProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  qualifications?: string;
}

export interface LecturerPublic {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  qualifications?: string;
  courses: Array<{
    id: string;
    name: string;
    description?: string;
    subject: string;
    level?: string;
    hourlyRate: number;
    duration: number;
  }>;
}

export interface LecturerListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  qualifications?: string;
  coursesCount: number;
  classesCount: number;
  joinedDate: string;
}
