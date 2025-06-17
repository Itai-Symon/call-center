export type TaskStatus = 'Open' | 'In Progress' | 'Completed';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export interface Tag {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  call_id?: number;
}

export interface Call {
  id: number;
  title: string;
  tags: Tag[];
  tasks: Task[];
}
