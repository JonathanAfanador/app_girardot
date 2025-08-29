import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputBaseProps {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea';
}

type InputProps = InputBaseProps & 
  ( // Union discriminada
    | ({ as?: 'input' } & InputHTMLAttributes<HTMLInputElement>)
    | ({ as: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, as = 'input', ...props }, ref) => {
    const commonClasses = `block w-full px-4 py-2 border ${
      error ? 'border-red-500' : 'border-gray-300'
    } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`;

    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        
        {as === 'textarea' ? (
          <textarea
            {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={`${commonClasses} resize-y`}
            rows={(props as TextareaHTMLAttributes<HTMLTextAreaElement>).rows || 3}
          />
        ) : (
          <input
            {...props as InputHTMLAttributes<HTMLInputElement>}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={commonClasses}
          />
        )}
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;