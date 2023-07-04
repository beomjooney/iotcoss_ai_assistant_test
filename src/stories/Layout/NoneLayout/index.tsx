import { ReactNode } from 'react';

export interface NoneLayoutProps {
  children: ReactNode;
}

function NoneLayout({ children }: NoneLayoutProps) {
  return children;
}

export default NoneLayout;
