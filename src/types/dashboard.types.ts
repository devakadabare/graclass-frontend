export interface LecturerDashboard {
  overview: {
    totalCourses: number;
    activeCourses: number;
    totalClasses: number;
    totalStudents: number;
    totalEarnings: string;
    thisMonthEarnings: string;
  };
  classes: {
    upcoming: number;
    completed: number;
    cancelled: number;
    thisMonth: number;
    thisWeek: number;
  };
  recentActivity: {
    enrollments: Array<{
      courseName: string;
      studentName?: string;
      groupName?: string;
      status: string;
      enrolledAt: string;
    }>;
  };
  upcomingSchedule: Array<{
    id: string;
    courseName: string;
    subject: string;
    studentName?: string;
    groupName?: string;
    classDate: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    location?: string;
  }>;
}

export interface StudentDashboard {
  overview: {
    totalEnrollments: number;
    approvedEnrollments: number;
    pendingEnrollments: number;
    totalClasses: number;
  };
  classes: {
    upcoming: number;
    completed: number;
  };
  enrolledCourses: Array<{
    courseName: string;
    subject: string;
    level?: string;
    lecturer: string;
    enrolledAt?: string;
  }>;
  upcomingSchedule: Array<{
    id: string;
    courseName: string;
    subject: string;
    lecturer: string;
    classDate: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    location?: string;
  }>;
}
