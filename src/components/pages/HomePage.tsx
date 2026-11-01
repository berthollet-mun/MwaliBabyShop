import React from 'react';
import { CategoryGrid } from '../home/CategoryGrid';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col flex-1">
      <CategoryGrid onNavigate={onNavigate} />
    </div>
  );
};
