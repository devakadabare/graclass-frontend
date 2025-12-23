import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScheduleItem {
  id: string;
  courseName: string;
  subject: string;
  studentName?: string;
  groupName?: string;
  lecturer?: string;
  classDate: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  location?: string;
}

interface UpcomingClassesProps {
  classes: ScheduleItem[];
  isLecturer?: boolean;
}

export const UpcomingClasses: React.FC<UpcomingClassesProps> = ({ classes, isLecturer = true }) => {
  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No upcoming classes scheduled
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{classItem.courseName}</h4>
                <Badge variant="secondary">{classItem.subject}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(classItem.classDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {classItem.startTime} - {classItem.endTime}
                </div>
                {isLecturer ? (
                  <span>
                    {classItem.studentName || classItem.groupName || 'No participant'}
                  </span>
                ) : (
                  <span>{classItem.lecturer}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {classItem.meetingLink && (
                <Button size="sm" asChild>
                  <a href={classItem.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </a>
                </Button>
              )}
              {classItem.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {classItem.location}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
