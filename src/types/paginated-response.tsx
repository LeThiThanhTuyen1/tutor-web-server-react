export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  succeeded: boolean;
  message: string | null;
}

export interface PaginationFilter {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  status?: string;
}
