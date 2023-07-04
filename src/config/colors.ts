import { JobGroupEnum } from './types';

export const jobColorKey = (value: string) => {
  const i = Object.values(JobGroupEnum).indexOf(value);
  if (i < 0) return 'primary';
  return Object.keys(JobGroupEnum)[i].toLocaleLowerCase();
};
