import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { SelectQueryBuilder } from 'typeorm';

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
): Promise<PaginatedResponse<T>> {
  const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = paginationDto;

  // Apply sorting if sortBy is provided
  if (sortBy) {
    const table = queryBuilder.alias;
    queryBuilder.orderBy(
      `${table}.${sortBy}`,
      sortOrder.toUpperCase() as 'ASC' | 'DESC',
    );
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const [items, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
}
