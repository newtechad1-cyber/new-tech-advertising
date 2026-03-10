/**
 * Hook to get school-specific color schemes
 * Returns Tailwind class names for primary and secondary colors based on school slug
 */

export const getSchoolColors = (schoolSlug) => {
  // Hampton-Dumont specific colors (red and black)
  if (schoolSlug === 'hampton-dumont') {
    return {
      primary: {
        bg: 'bg-red-600',
        bgDark: 'bg-red-700',
        bgLight: 'bg-red-50',
        text: 'text-red-600',
        textDark: 'text-red-800',
        border: 'border-red-200',
        ring: 'ring-red-500',
      },
      secondary: {
        bg: 'bg-black',
        bgDark: 'bg-gray-900',
        text: 'text-black',
        border: 'border-gray-800',
      },
      accent: {
        bg: 'bg-red-100',
        text: 'text-red-700',
      },
      gradient: {
        hero: 'from-red-700 via-red-600 to-black',
        button: 'from-red-600 to-red-700',
      },
      hex: {
        primary: '#C71C26',
        secondary: '#000000',
      }
    };
  }

  // Default colors (blue and purple) for all other schools
  return {
    primary: {
      bg: 'bg-blue-600',
      bgDark: 'bg-blue-700',
      bgLight: 'bg-blue-50',
      text: 'text-blue-600',
      textDark: 'text-blue-800',
      border: 'border-blue-200',
      ring: 'ring-blue-500',
    },
    secondary: {
      bg: 'bg-purple-600',
      bgDark: 'bg-purple-700',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
    accent: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
    },
    gradient: {
      hero: 'from-blue-700 via-blue-600 to-purple-700',
      button: 'from-blue-600 to-blue-700',
    },
    hex: {
      primary: '#2563eb',
      secondary: '#7c3aed',
    }
  };
};