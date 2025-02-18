// src/components/ui/Dialog.tsx
import React, { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;  // Add className here
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className = '' }) => {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${className}`}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-black text-white p-6 rounded-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing dialog when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
