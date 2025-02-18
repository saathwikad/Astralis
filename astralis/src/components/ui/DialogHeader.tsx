// src/components/ui/DialogHeader.tsx
import React, { ReactNode } from 'react';

interface DialogHeaderProps {
  children: ReactNode;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="text-xl font-semibold">{children}</div>;
};

export default DialogHeader;
