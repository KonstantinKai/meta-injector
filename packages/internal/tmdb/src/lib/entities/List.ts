export interface List<T> {
  results: T[];
  page: number;
  totalResults: number;
  totalPages: number;
}
