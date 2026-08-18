import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Zap, Inbox, Search, MapPin, Calendar, Bell, Star } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No Data Found',
  description = 'There are no items to display right now.',
  ctaLabel,
  onCtaClick,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'p-4 space-y-2 max-w-sm',
    md: 'p-6 sm:p-8 space-y-3 max-w-md',
    lg: 'p-8 sm:p-12 space-y-4 max-w-lg',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <Card className={`text-center mx-auto flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="p-3.5 rounded-2xl bg-[#6750a4]/20 border border-[#6750a4]/30 text-[#cfbcff] shrink-0">
        <Icon className={`${iconSizes[size]}`} />
      </div>

      <h3 className="font-headline font-bold text-lg text-white">{title}</h3>
      <p className="text-xs text-[#cbc4d2] leading-relaxed">{description}</p>

      {ctaLabel && (
        <div className="pt-2">
          <Button variant="primary" size={size === 'sm' ? 'sm' : 'md'} onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}
