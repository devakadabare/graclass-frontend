import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/api/course.api';
import { studentApi } from '@/api/student.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CourseDetailsModalProps {
  courseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailsModal({ courseId, open, onOpenChange }: CourseDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch course details
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course-details', courseId],
    queryFn: () => courseApi.getCourseDetails(courseId),
    enabled: open && !!courseId,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: () => studentApi.enrollInCourse({ courseId }),
    onSuccess: () => {
      toast.success('Enrollment request submitted successfully!');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    },
  });

  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !course) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8 text-destructive">
            Failed to load course details
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Calculate allImages array after checking course exists
  const allImages = [
    ...(course.flyer ? [{ id: 'flyer', imageUrl: course.flyer, order: -1 }] : []),
    ...(course.images || []),
  ];

  const handlePreviousImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      setImageLoadError(false);
      setImageLoading(true);
    }
  };

  const handleNextImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      setImageLoadError(false);
      setImageLoading(true);
    }
  };

  // Debug: Log all images
  console.log('Course images:', {
    flyer: course.flyer,
    images: course.images,
    allImages: allImages,
    totalCount: allImages.length
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.name}</DialogTitle>
          <DialogDescription>
            By {course.lecturer.firstName} {course.lecturer.lastName}
          </DialogDescription>
        </DialogHeader>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {imageLoadError ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-2">Failed to load image</p>
                  <p className="text-xs text-muted-foreground">Image {currentImageIndex + 1} of {allImages.length}</p>
                </div>
              ) : (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <img
                    src={allImages[currentImageIndex].imageUrl}
                    alt={`${course.name} - Image ${currentImageIndex + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => {
                      console.log(`Image ${currentImageIndex + 1} loaded successfully:`, allImages[currentImageIndex].imageUrl);
                      setImageLoadError(false);
                      setImageLoading(false);
                    }}
                    onError={(e) => {
                      console.error(`Failed to load image ${currentImageIndex + 1}:`, allImages[currentImageIndex].imageUrl);
                      setImageLoadError(true);
                      setImageLoading(false);
                    }}
                  />
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students Enrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.enrollmentsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Classes Held
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.classesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.duration}</div>
              <div className="text-xs text-muted-foreground">minutes</div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Course Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Course Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{course.subject}</p>
                </div>
              </div>

              {course.level && (
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium text-lg">${course.hourlyRate}/hour</p>
                </div>
              </div>

              {course.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(course.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {course.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{course.description}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Instructor</h3>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                {course.lecturer.firstName.charAt(0)}{course.lecturer.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium">
                  {course.lecturer.firstName} {course.lecturer.lastName}
                </p>
                {course.lecturer.email && (
                  <p className="text-sm text-muted-foreground">{course.lecturer.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Enroll Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={enrollMutation.isPending}
            className="min-w-32"
          >
            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
