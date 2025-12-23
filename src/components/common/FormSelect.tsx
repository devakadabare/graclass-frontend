import { forwardRef, SelectHTMLAttributes } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, error, helperText, placeholder, options, value, onValueChange, disabled }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger ref={ref} className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
