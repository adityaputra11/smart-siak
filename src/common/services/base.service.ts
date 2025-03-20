/* eslint-disable prettier/prettier */
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SearchDto } from '../dto/search.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { searchAndPaginate } from '../utils/search.util';

/**
 * Base service providing generic CRUD operations for entities
 */
export class BaseService<T extends { id: number | string }> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Create a new entity
   * @param createDto Data to create the entity
   * @returns The created entity
   */
  async create(createDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find all entities with optional filtering
   * @param filter Optional filter conditions
   * @returns Array of entities
   */
  async findAll(filter?: FindOptionsWhere<T>): Promise<T[]> {
    try {
      return await this.repository.find({ where: filter });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find a single entity by ID
   * @param id Entity ID
   * @returns The found entity or throws NotFoundException
   */
  async findOne(id: number | string): Promise<T> {
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
      });

      if (!entity) {
        throw new NotFoundException(`Entity with ID "${id}" not found`);
      }

      return entity;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update an entity by ID
   * @param id Entity ID
   * @param updateDto Data to update
   * @returns The updated entity
   */
  async update(id: number | string, updateDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = await this.findOne(id);
      const updated = this.repository.merge(entity, updateDto);
      return await this.repository.save(updated);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete an entity by ID
   * @param id Entity ID
   * @returns The deleted entity
   */
  async remove(id: number | string): Promise<T> {
    try {
      const entity = await this.findOne(id);
      return await this.repository.remove(entity);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Search entities with pagination
   * @param searchDto Search and pagination parameters
   * @param defaultSearchFields Default fields to search in
   * @returns Paginated search results
   */
  async search(
    searchDto: SearchDto,
    defaultSearchFields: string[] = [],
  ): Promise<PaginatedResponse<T>> {
    try {
      const queryBuilder = this.getQueryBuilder();
      return await searchAndPaginate(
        queryBuilder,
        searchDto,
        defaultSearchFields,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a custom search with a pre-configured query builder
   * @param queryBuilder Custom query builder
   * @param searchDto Search and pagination parameters
   * @param defaultSearchFields Default fields to search in
   * @returns Paginated search results
   */
  async customSearch(
    queryBuilder: SelectQueryBuilder<T>,
    searchDto: SearchDto,
    defaultSearchFields: string[] = [],
  ): Promise<PaginatedResponse<T>> {
    try {
      return await searchAndPaginate(
        queryBuilder,
        searchDto,
        defaultSearchFields,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a basic query builder for the entity
   * @returns SelectQueryBuilder for the entity
   */
  protected getQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.repository.metadata.name);
  }

  /**
   * Handle service errors
   * @param error The caught error
   */
  protected handleError(error: any): never {
    if (error.response) {
      throw error;
    }

    console.error('Service error:', error);

    throw error;
  }

  /**
   * Count entities with optional filtering
   * @param filter Optional filter conditions
   * @returns Number of entities
   */
  async count(filter?: FindOptionsWhere<T>): Promise<number> {
    try {
      return await this.repository.count({ where: filter });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check if an entity exists
   * @param filter Filter conditions
   * @returns Boolean indicating if entity exists
   */
  async exists(filter: FindOptionsWhere<T>): Promise<boolean> {
    try {
      const count = await this.repository.count({ where: filter });
      return count > 0;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create multiple entities
   * @param createDtos Array of data to create entities
   * @returns The created entities
   */
  async createMany(createDtos: DeepPartial<T>[]): Promise<T[]> {
    try {
      const entities = createDtos.map((dto) => this.repository.create(dto));
      return await this.repository.save(entities);
    } catch (error) {
      this.handleError(error);
    }
  }
}
