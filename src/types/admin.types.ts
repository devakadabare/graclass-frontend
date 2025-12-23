export interface SystemStats {
  overview: {
    totalUsers: number;
    totalLecturers: number;
    totalStudents: number;
    totalCourses: number;
    activeCourses: number;
    totalClasses: number;
    totalEnrollments: number;
    pendingEnrollments: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    _count?: {
      courses: number;
      classes: number;
    };
  };
}

export interface AdminCourse {
  id: string;
  name: string;
  subject: string;
  level?: string;
  duration: number;
  hourlyRate: number;
  isActive: boolean;
  createdAt: string;
  lecturer: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
  _count: {
    enrollments: number;
    classes: number;
  };
}

export interface AdminEnrollment {
  id: string;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  course: {
    name: string;
    subject: string;
  };
  student: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
}
