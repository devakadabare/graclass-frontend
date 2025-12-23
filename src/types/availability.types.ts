export interface Availability {
  id: string;
  lecturerId: string;
  isRecurring: boolean;
  dayOfWeek?: number;
  dayName?: string;
  specificDate?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  isRecurring: boolean;
  dayOfWeek?: number;
  specificDate?: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityDto {
  startTime?: string;
  endTime?: string;
}
