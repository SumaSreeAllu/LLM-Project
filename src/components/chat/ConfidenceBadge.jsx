import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConfidenceBadge({ confidence }) {
  if (confidence == null) return null;

  const level = confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low';

  const config = {
    high: {
      icon: ShieldCheck,
      label: 'High confidence',
      classes: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    medium: {
      icon: ShieldQuestion,
      label: 'Medium confidence',
      classes: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    low: {
      icon: ShieldAlert,
      label: 'Low confidence',
      classes: 'text-red-500 bg-red-50 border-red-200',
    },
  };

  const { icon: Icon, label, classes } = config[level];

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', classes)}>
      <Icon className="w-3.5 h-3.5" />
      <span>{confidence}%</span>
      <span className="hidden sm:inline">— {label}</span>
    </div>
  );
}
