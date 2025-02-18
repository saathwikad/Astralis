// src/components/ui/DialogContent.tsx
import React, { ReactNode } from 'react';

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export default DialogContent;
