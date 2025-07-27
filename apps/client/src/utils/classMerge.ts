import { twMerge } from 'tailwind-merge';

export function merge(...classes: string[]) {
  return twMerge(...classes);
}
