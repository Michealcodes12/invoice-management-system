import React from 'react';

export default function StatusBadge({ status }) {
  let colors = '';
  switch (status.toLowerCase()) {
    case 'paid': colors = 'bg-[#33D69F]/10 text-[#33D69F]'; break;
    case 'pending': colors = 'bg-[#FF8F00]/10 text-[#FF8F00]'; break;
    case 'draft': colors = 'bg-slate-400/10 text-slate-500 dark:bg-slate-300/10 dark:text-[#DFE3FA]'; break;
    case 'overdue': colors = 'bg-tertiary/10 text-tertiary'; break;
    default: colors = 'bg-gray-500/10 text-gray-500';
  }

  return (
    <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg min-w-[104px] ${colors}`}>
      <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_3px_currentColor]"></div>
      <span className="text-xs font-bold leading-none">{status}</span>
    </div>
  );
}
