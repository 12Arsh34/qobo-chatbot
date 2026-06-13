import React from 'react';

const Logo = ({ className = "text-3xl" }) => {
  return (
    <div className={`font-logo font-bold tracking-tight flex items-center ${className}`}>
      <span className="text-primary">q</span>
      <span className="text-secondary">o</span>
      <span className="text-dark">b</span>
      <span className="text-secondary">o</span>
    </div>
  );
};

export default Logo;
