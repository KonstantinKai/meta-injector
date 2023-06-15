export const upperFirstLetter = (str: string): string =>
  str.slice(0, 1).toUpperCase() + str.toLowerCase().slice(1);
