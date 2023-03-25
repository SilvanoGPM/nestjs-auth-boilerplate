export interface Pageable {
  page: number;
  size: number;
}

export interface Page<T> {
  data: T[];
  hasNext: boolean;
  total: number;
  page: number;
  size: number;
}
