import React from 'react';
import { CategoryGrid } from '../home/CategoryGrid';
import { HeroCarousel } from '../home/HeroCarousel';
import { CategoryProductSections } from '../home/CategoryProductSections';
import { WhyChooseUs } from '../home/WhyChooseUs';
import { Testimonials } from '../home/Testimonials';
import { AddressContactHighlight } from '../home/AddressContactHighlight';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col flex-1">
      <HeroCarousel onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <CategoryProductSections onNavigate={onNavigate} />
      <WhyChooseUs />
      <Testimonials />
      <AddressContactHighlight />
    </div>
  );
};
