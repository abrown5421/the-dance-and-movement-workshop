export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  searchFields?: readonly string[];
  filters?: Readonly<Record<string, string>>;
  filterAnyOf?: {
    readonly fields: readonly string[];
    readonly value: string;
  };
  dateRange?: {
    readonly startField: string;
    readonly endField: string;
    readonly start?: string;
    readonly end?: string;
  };
}

export interface PaginatedResult<T> {
  readonly data: readonly T[];
  readonly meta: {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly totalPages: number;
  };
}