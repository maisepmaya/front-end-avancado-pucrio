export interface Card {
  name: string;
  life: string;
  currLife: number;
  ac: string;
  level: string;
  info: string;
  id: string;
  sheetId: string;
}

export type Cards = Record<string, Card>;
