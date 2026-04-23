import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  // Base styles shared across all variants
  const baseStyles = "font-bold rounded-full transition-all flex items-center justify-center gap-2";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-primary hover:bg-primary-container text-white shadow-lg shadow-primary/20";
      break;
    case 'secondary':
      variantStyles = "bg-surface-container-low dark:bg-inverse-surface text-on-surface-variant hover:bg-surface-variant dark:text-[#DFE3FA]";
      break;
    case 'danger':
      variantStyles = "bg-error hover:bg-tertiary-container text-white";
      break;
    case 'dark':
      variantStyles = "bg-[#373B53] hover:bg-[#0C0E16] text-[#888EB0] hover:text-[#DFE3FA]";
      break;
    case 'light':
      variantStyles = "bg-[#f9fafe] dark:bg-[#252945] hover:bg-[#dfe3fa] dark:hover:bg-white dark:hover:text-black text-[#7E88C3] dark:text-[#DFE3FA]";
      break;
    case 'edit':
      variantStyles = "bg-surface-container-low hover:bg-[#dfe3fa] dark:bg-[#373B53] dark:hover:bg-white dark:hover:text-black dark:text-[#DFE3FA] text-[#7E88C3]";
      break;
    case 'custom':
      variantStyles = "";
      break;
    default:
      variantStyles = "bg-primary text-white";
  }

  // Apply default padding if not overridden
  const hasPadding = className.includes('px-') || className.includes('p-') || className.includes('py-') || className.includes('pl-');
  const paddingStyles = hasPadding ? '' : 'px-5 py-2.5';

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${paddingStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
