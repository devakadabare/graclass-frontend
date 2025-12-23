import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { groupApi } from '@/api/group.api';
import { toast } from 'sonner';

const groupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function GroupForm({ onSuccess, onCancel }: GroupFormProps) {
  const createMutation = useMutation({
    mutationFn: (data: GroupFormData) => groupApi.createGroup(data),
    onSuccess: () => {
      toast.success('Group created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create group');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = (data: GroupFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Group Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Computer Science Study Group"
      />

      <FormTextarea
        label="Description (Optional)"
        {...register('description')}
        error={errors.description?.message}
        placeholder="A group for students studying computer science..."
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
}
