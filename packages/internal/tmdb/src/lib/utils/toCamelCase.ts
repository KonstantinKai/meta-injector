import { upperFirstLetter } from './upperFirstLetter';

export const toCamelCase = (str: string): string => str.replace(/[_\-\s]+(\w+)/g, (m, m1) => upperFirstLetter(m1));
