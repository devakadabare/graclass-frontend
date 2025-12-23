import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { availabilityApi } from '@/api/availability.api';
import { toast } from 'sonner';
import type { Availability, CreateAvailabilityDto } from '@/types/availability.types';

const availabilitySchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  isRecurring: z.boolean(),
});

type AvailabilityFormData = z.infer<typeof availabilitySchema>;

interface AvailabilityFormProps {
  availability?: Availability;
  onSuccess: () => void;
  onCancel: () => void;
}

const DAYS = [
  { value: '0', label: 'Monday' },
  { value: '1', label: 'Tuesday' },
  { value: '2', label: 'Wednesday' },
  { value: '3', label: 'Thursday' },
  { value: '4', label: 'Friday' },
  { value: '5', label: 'Saturday' },
  { value: '6', label: 'Sunday' },
];

export function AvailabilityForm({ availability, onSuccess, onCancel }: AvailabilityFormProps) {
  const createMutation = useMutation({
    mutationFn: (data: CreateAvailabilityDto) => availabilityApi.createAvailability(data),
    onSuccess: () => {
      toast.success('Availability added successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add availability');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => availabilityApi.updateAvailability(availability!.id, data),
    onSuccess: () => {
      toast.success('Availability updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: availability ? {
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isRecurring: availability.isRecurring,
    } : {
      isRecurring: true,
    },
  });

  const onSubmit = (data: AvailabilityFormData) => {
    if (availability) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const dayOfWeek = watch('dayOfWeek')?.toString();
  const isRecurring = watch('isRecurring');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSelect
        label="Day of Week"
        placeholder="Select a day"
        value={dayOfWeek}
        onValueChange={(value) => setValue('dayOfWeek', parseInt(value))}
        options={DAYS}
        error={errors.dayOfWeek?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Start Time"
          type="time"
          {...register('startTime')}
          error={errors.startTime?.message}
        />

        <FormInput
          label="End Time"
          type="time"
          {...register('endTime')}
          error={errors.endTime?.message}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRecurring"
          checked={isRecurring}
          onCheckedChange={(checked) => setValue('isRecurring', checked as boolean)}
        />
        <Label htmlFor="isRecurring" className="text-sm font-normal">
          Recurring weekly
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : availability ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
}
