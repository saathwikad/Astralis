export interface Star {
  position: [number, number, number];
  id: number;
}

export interface Connection {
  start: number;
  end: number;
}

export interface Constellation {
  id: number;
  name: string;
  latinName: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  description: string;
  isCreateCard?: boolean;
  starPositions: [number, number, number][];
  connections: [number, number][];
}