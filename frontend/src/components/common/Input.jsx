import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`px-4 py-2.5 rounded-xl border bg-gray-50 text-dark outline-none transition-all duration-200
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white'
          }
        `}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
