import { Nullable } from '../types';
import { List } from './List';

export type DiscoverMovies = List<{
  posterPath: Nullable<string>;
  adult: boolean;
  overview: string;
  releaseDate: string;
  genreIds: string[];
  id: number;
}>;
