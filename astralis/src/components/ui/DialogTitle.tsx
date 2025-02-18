// src/components/ui/DialogTitle.tsx
import React, { ReactNode } from 'react';

interface DialogTitleProps {
  children: ReactNode;
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <h3 className="text-2xl">{children}</h3>;
};

export default DialogTitle;
