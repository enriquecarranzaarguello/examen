import { PositionType } from './types';

export interface MarkerI {
  id: string;
  picture: any;
  name: string;
  address: string;
  stars: number;
  price?: number;
  position: PositionType;
}
