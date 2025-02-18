// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
