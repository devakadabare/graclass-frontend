import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Users, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { CourseImageGallery } from './CourseImageGallery';
import type { Course } from '@/types/course.types';

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  showActions?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      <Card className="flex flex-col">
        {/* Flyer Image */}
        {course.flyer && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={course.flyer}
              alt={course.name}
              className="w-full h-full object-cover"
            />
            {course.images && course.images.length > 0 && (
              <button
                onClick={() => setShowGallery(true)}
                className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-black/80 transition-colors"
              >
                <ImageIcon className="w-3 h-3" />
                {course.images.length} images
              </button>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{course.subject}</Badge>
                {course.level && <Badge variant="outline">{course.level}</Badge>}
                {!course.isActive && <Badge variant="destructive">Inactive</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {course.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {course.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration} min
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ${course.hourlyRate}/hr
            </div>
            {course.enrollmentsCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.enrollmentsCount} students
              </div>
            )}
          </div>

          {/* Image thumbnails if no flyer */}
          {!course.flyer && course.images && course.images.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowGallery(true)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <ImageIcon className="w-4 h-4" />
                View {course.images.length} course images
              </button>
            </div>
          )}
        </CardContent>
        {showActions && (
          <CardFooter className="border-t pt-4 gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(course.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Image Gallery Dialog */}
      {course.images && course.images.length > 0 && (
        <CourseImageGallery
          images={course.images}
          open={showGallery}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
};
