import { Task } from './Task';

export type Stay = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
};
