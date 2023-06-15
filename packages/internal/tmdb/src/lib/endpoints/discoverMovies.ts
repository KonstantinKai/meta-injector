import { DiscoverMovies } from '../entities';
import { toCamelCase } from '../utils/toCamelCase';
import { Requester } from './Requester';

export const discoverMovies = async (
  requester: Requester,
): Promise<DiscoverMovies> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await requester.get<any>('/discover/movie', {
    page: 1,
  });

  return {
    totalPages: result.total_pages,
    totalResults: result.total_results,
    page: 1,
    results: (result.results as []).map((obj) => Object.keys(obj).reduce((overriden, key) => {
      overriden[toCamelCase(key)] = obj[key];

      return overriden;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any)),
  };
};
