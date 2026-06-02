export interface Subject {
  id: string;
  title: string;
  subtitle: string;
  group: string;
  icon: string;
  available: boolean;
  driveId: string;
  type?: 'drive' | 'docs' | 'sheets';
}

export interface Group {
  key: string;
  label: string;
}

export interface Student {
  name: string;
  mobile: string;
  cls: string;
}
