import { Nullable } from '../types';

export interface ProductionCompany {
  id: string;
  name: string;
  logoPath: Nullable<string>;
  originCountry: string;
}
