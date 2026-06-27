import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Reusable FormInput component for all form fields
 * Replaces all inline input styling (w-full px-3 py-2 border, etc.)
 *
 * Usage:
 * <FormInput
 *   label="Cattle Tag"
 *   type="text"
 *   placeholder="e.g., TAG-001"
 *   required
 *   error={errors.tag}
 * />
 *
 * <FormInput
 *   label="Birth Date"
 *   type="date"
 *   required
 * />
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    error,
    helperText,
    required,
    className,
    type = 'text',
    disabled,
    ...props
  }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id || props.name}-error` : undefined}
          className={`
            w-full
            px-3 py-2
            border
            rounded-lg
            text-base
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-blue-500

            ${hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500'
            }

            ${disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-900'
            }

            placeholder:text-gray-400

            ${className || ''}
          `}
          {...props}
        />

        {error && (
          <p
            id={`${props.id || props.name}-error`}
            className="text-sm font-medium text-red-600 mt-1"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
