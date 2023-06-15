import { Nullable } from '../types';
import { Genre } from './Genre';
import { ProductionCompany } from './ProductionCompany';
import { ProductionCountry } from './ProductionCountry';
import { SpokenLanguage } from './SpokenLanguage';

export interface Movie {
  adult: boolean;
  backdropPath: Nullable<string>;
  belongsToCollection: Nullable<Record<string, unknown>>;
  budget: number;
  genres: Genre[];
  homepage: Nullable<string>;
  id: string;
  imdbId: Nullable<string>;
  originalLanguage: string;
  originalTitle: string;
  overview: Nullable<string>;
  popularity: number;
  posterPath: Nullable<string>;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  releaseDate: Date;
  revenue: number;
  runtime: Nullable<number>;
  spokenLanguages: SpokenLanguage[];
  status: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';
  tagline: Nullable<string>;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}
