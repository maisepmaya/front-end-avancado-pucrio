export interface Sheet {
  icon: string;
  name: string;
  life: string;
  ac: string;
  level: string;
  info: string;
  id: string;
}

export interface SheetCreation {
  icon: string;
  name: string;
  life: string;
  ac: string;
  level: string;
  info: string;
}

export type Sheets = Record<string, Sheet>;
