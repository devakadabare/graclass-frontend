import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { courseApi } from '@/api/course.api';
import { studentApi } from '@/api/student.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput } from '@/components/common/FormInput';
import { BookOpen, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', 'search', searchQuery, page],
    queryFn: () => courseApi.searchCourses({ subject: searchQuery, page, limit: 12 }),
  });

  const handleEnroll = async (courseId: string) => {
    try {
      await studentApi.enrollInCourse({ courseId });
      toast.success('Enrollment request submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  };

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground">Explore and enroll in available courses</p>
        </div>

        <div className="max-w-md">
          <FormInput
            placeholder="Search by subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData?.data?.map((course: any) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.subject}</span>
                  {course.level && <Badge variant="secondary">{course.level}</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  <span>${course.hourlyRate}/hour</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  By {course.lecturer?.firstName} {course.lecturer?.lastName}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {coursesData?.data?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No courses found. Try adjusting your search.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
