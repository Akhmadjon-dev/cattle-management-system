/**
 * Calculate age in years from birth date
 */
export const getAge = (birthDate: string): number => {
  const now = new Date();
  const birth = new Date(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format age for display (e.g., "2 years, 3 months")
 */
export const formatAge = (birthDate: string): string => {
  const now = new Date();
  const birth = new Date(birthDate);

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  }

  if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  return `${years}y ${months}m`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for input type="date"
 */
export const formatDateForInput = (date: string): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'sold':
      return 'bg-gray-100 text-gray-800';
    case 'deceased':
      return 'bg-red-100 text-red-800';
    case 'removed':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get gender symbol
 */
export const getGenderSymbol = (gender: string): string => {
  return gender === 'male' ? '♂' : '♀';
};
