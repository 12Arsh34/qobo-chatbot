import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', className = '', isLoading = false, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-soft focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-secondary text-white hover:bg-secondary-hover",
    outline: "border-2 border-primary text-primary hover:bg-primary-light",
    ghost: "bg-transparent text-dark hover:bg-gray-100 shadow-none"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
