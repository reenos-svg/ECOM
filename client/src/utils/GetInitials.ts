// utils.js or a similar utility file
export const getInitials = (name : string) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(word => word.charAt(0).toUpperCase()).join('');
    return initials.length >= 2 ? initials.substring(0, 2) : initials;
  };
  