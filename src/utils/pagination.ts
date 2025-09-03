import { PaginationParams } from '../types';

export interface PaginationResult {
  skip: number;
  take: number;
  orderBy: any;
}

export const getPaginationParams = (query: any): PaginationResult => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';

  const skip = (page - 1) * limit;
  const take = limit;
  const orderBy = { [sortBy]: sortOrder };

  return { skip, take, orderBy };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};