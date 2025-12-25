export interface Course {
  id: string;
  lecturerId: string;
  name: string;
  description?: string;
  subject: string;
  level?: string;
  duration: number;
  hourlyRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  enrollmentsCount?: number;
  classesCount?: number;
}

export interface CreateCourseDto {
  name: string;
  description?: string;
  subject: string;
  level?: string;
  duration: number;
  hourlyRate: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  subject?: string;
  level?: string;
  duration?: number;
  hourlyRate?: number;
  isActive?: boolean;
}

export interface CourseSearchParams {
  subject?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export interface CourseSearchResult {
  id: string;
  name: string;
  description?: string;
  subject: string;
  level?: string;
  duration: number;
  hourlyRate: number;
  lecturer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  enrollmentsCount: number;
}

export interface CourseImage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface DetailedCourseInfo {
  id: string;
  name: string;
  description?: string;
  subject: string;
  level?: string;
  duration: number;
  hourlyRate: number;
  flyer?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: CourseImage[];
  lecturer: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  enrollmentsCount: number;
  classesCount: number;
  isOwner: boolean;
}
