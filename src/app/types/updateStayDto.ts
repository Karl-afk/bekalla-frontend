import { Task } from './Task';

export type UpdateStayDto = {
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  tasks: Task[];
};
