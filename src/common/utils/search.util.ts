import { SelectQueryBuilder } from 'typeorm';
import { SearchDto } from '../dto/search.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { paginate } from './pagination.util';

/**
 * Apply search filters to a TypeORM query builder
 * @param queryBuilder The TypeORM query builder to apply search to
 * @param searchDto The search parameters
 * @param defaultSearchFields Default fields to search in if none specified
 * @returns The query builder with search conditions applied
 */
export function applySearch<T>(
  queryBuilder: SelectQueryBuilder<T>,
  searchDto: SearchDto,
  defaultSearchFields: string[] = [],
): SelectQueryBuilder<T> {
  const { query, fields } = searchDto;

  if (!query || query.trim() === '') {
    return queryBuilder;
  }

  const searchFields = fields
    ? fields.split(',').map((field) => field.trim())
    : defaultSearchFields;

  if (searchFields.length === 0) {
    return queryBuilder;
  }

  const alias = queryBuilder.alias;
  const searchTerm = `%${query.trim()}%`;

  const whereConditions = searchFields.map((field) => {
    return `LOWER(${alias}.${field}) LIKE LOWER(:searchTerm)`;
  });

  queryBuilder.andWhere(whereConditions.join(' OR '), { searchTerm });


  return queryBuilder;
}

/**
 * Search and paginate results
 * @param queryBuilder The TypeORM query builder
 * @param searchDto The search and pagination parameters
 * @param defaultSearchFields Default fields to search in if none specified
 * @returns Paginated search results
 */
export async function searchAndPaginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  searchDto: SearchDto,
  defaultSearchFields: string[] = [],
): Promise<PaginatedResponse<T>> {
  console.log('Default search fields:', defaultSearchFields);
  console.log('Search DTO:', searchDto);

  const searchedQueryBuilder = applySearch(
    queryBuilder,
    searchDto,
    defaultSearchFields,
  );

  return paginate(searchedQueryBuilder, searchDto);
}
