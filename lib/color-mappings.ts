// Color mapping from old neutral colors to new chartreuse palette
export const colorMappings = {
  // Background colors
  'bg-neutral-950': 'bg-chartreuse-950 dark:bg-chartreuse-950',
  'bg-neutral-900': 'bg-chartreuse-900 dark:bg-chartreuse-900',
  'bg-neutral-800': 'bg-chartreuse-800 dark:bg-chartreuse-800',
  'bg-neutral-700': 'bg-chartreuse-700 dark:bg-chartreuse-700',
  'bg-neutral-600': 'bg-chartreuse-600 dark:bg-chartreuse-600',
  'bg-neutral-500': 'bg-chartreuse-500 dark:bg-chartreuse-500',
  'bg-neutral-400': 'bg-chartreuse-400 dark:bg-chartreuse-400',
  'bg-neutral-300': 'bg-chartreuse-300 dark:bg-chartreuse-300',
  'bg-neutral-200': 'bg-chartreuse-200 dark:bg-chartreuse-200',
  'bg-neutral-100': 'bg-chartreuse-100 dark:bg-chartreuse-100',
  'bg-neutral-50': 'bg-chartreuse-50 dark:bg-chartreuse-50',
  
  // Text colors
  'text-neutral-950': 'text-chartreuse-950 dark:text-chartreuse-50',
  'text-neutral-900': 'text-chartreuse-900 dark:text-chartreuse-100',
  'text-neutral-800': 'text-chartreuse-800 dark:text-chartreuse-200',
  'text-neutral-700': 'text-chartreuse-700 dark:text-chartreuse-300',
  'text-neutral-600': 'text-chartreuse-600 dark:text-chartreuse-400',
  'text-neutral-500': 'text-chartreuse-500 dark:text-chartreuse-500',
  'text-neutral-400': 'text-chartreuse-400 dark:text-chartreuse-600',
  'text-neutral-300': 'text-chartreuse-300 dark:text-chartreuse-700',
  'text-neutral-200': 'text-chartreuse-200 dark:text-chartreuse-800',
  'text-neutral-100': 'text-chartreuse-100 dark:text-chartreuse-900',
  'text-neutral-50': 'text-chartreuse-50 dark:text-chartreuse-950',
  
  // Border colors
  'border-neutral-950': 'border-chartreuse-950 dark:border-chartreuse-950',
  'border-neutral-900': 'border-chartreuse-900 dark:border-chartreuse-900',
  'border-neutral-800': 'border-chartreuse-800 dark:border-chartreuse-800',
  'border-neutral-700': 'border-chartreuse-700 dark:border-chartreuse-700',
  'border-neutral-600': 'border-chartreuse-600 dark:border-chartreuse-600',
  'border-neutral-500': 'border-chartreuse-500 dark:border-chartreuse-500',
  'border-neutral-400': 'border-chartreuse-400 dark:border-chartreuse-400',
  'border-neutral-300': 'border-chartreuse-300 dark:border-chartreuse-300',
  'border-neutral-200': 'border-chartreuse-200 dark:border-chartreuse-200',
  'border-neutral-100': 'border-chartreuse-100 dark:border-chartreuse-100',
  'border-neutral-50': 'border-chartreuse-50 dark:border-chartreuse-50',
  
  // With opacity variations
  'bg-neutral-900/50': 'bg-chartreuse-100/50 dark:bg-chartreuse-900/50',
  'bg-neutral-800/10': 'bg-chartreuse-200/10 dark:bg-chartreuse-800/10',
  'bg-neutral-800/5': 'bg-chartreuse-200/5 dark:bg-chartreuse-800/5',
  'border-neutral-800/50': 'border-chartreuse-200/50 dark:border-chartreuse-800/50',
  
  // Hover states
  'hover:border-neutral-700': 'hover:border-chartreuse-300 dark:hover:border-chartreuse-700',
  'hover:bg-neutral-800': 'hover:bg-chartreuse-200 dark:hover:bg-chartreuse-800',
  'hover:text-neutral-100': 'hover:text-chartreuse-800 dark:hover:text-chartreuse-100',
  
  // Other accent colors - update to chartreuse variations
  'bg-blue-500/20': 'bg-chartreuse-400/20',
  'bg-purple-500/20': 'bg-chartreuse-500/20',
  'bg-emerald-500/20': 'bg-chartreuse-300/20',
  'bg-orange-500/20': 'bg-chartreuse-600/20',
  'bg-pink-500/20': 'bg-chartreuse-700/20',
  'bg-yellow-500/20': 'bg-chartreuse-200/20',
  
  'text-blue-400': 'text-chartreuse-400',
  'text-purple-400': 'text-chartreuse-500',
  'text-emerald-400': 'text-chartreuse-300',
  'text-orange-400': 'text-chartreuse-600',
  'text-pink-400': 'text-chartreuse-700',
  'text-yellow-400': 'text-chartreuse-200',
  
  // Gradient updates
  'from-blue-500/20': 'from-chartreuse-400/20',
  'from-purple-500/20': 'from-chartreuse-500/20',
  'from-emerald-500/20': 'from-chartreuse-300/20',
  'from-orange-500/20': 'from-chartreuse-600/20',
  'from-pink-500/20': 'from-chartreuse-700/20',
  'from-yellow-500/20': 'from-chartreuse-200/20',
  
  'via-blue-600/10': 'via-chartreuse-600/10',
  'via-purple-600/10': 'via-chartreuse-700/10',
  'via-emerald-600/10': 'via-chartreuse-500/10',
  'via-orange-600/10': 'via-chartreuse-800/10',
  'via-pink-600/10': 'via-chartreuse-900/10',
  'via-yellow-600/10': 'via-chartreuse-400/10',
};

// Function to update className strings
export function updateColorClasses(className: string): string {
  let updatedClass = className;
  
  Object.entries(colorMappings).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    updatedClass = updatedClass.replace(regex, newClass);
  });
  
  return updatedClass;
}