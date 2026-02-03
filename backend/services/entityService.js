/**
 * Unified Entity Service - Base44 Style
 * Handles all CRUD operations with automatic field management
 */

const mongoose = require('mongoose');

class EntityService {
  constructor(model, entityName) {
    this.model = model;
    this.entityName = entityName;
  }

  /**
   * List all records with sorting and pagination
   */
  async list(sort = '-created_date', page = 1, limit = 100) {
    try {
      const skip = (page - 1) * limit;
      
      const data = await this.model
        .find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await this.model.countDocuments();

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Filter records based on query parameters
   */
  async filter(filters = {}, sort = '-created_date', page = 1, limit = 100) {
    try {
      // Build MongoDB query from filters
      const query = this._buildQuery(filters);
      const skip = (page - 1) * limit;

      const data = await this.model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await this.model.countDocuments(query);

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get single record by ID
   */
  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${this.entityName} ID`);
        error.status = 400;
        throw error;
      }

      const data = await this.model.findById(id).lean();

      if (!data) {
        const error = new Error(`${this.entityName} not found`);
        error.status = 404;
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Create new record with auto-fields
   */
  async create(payload, userId = null) {
    try {
      const now = new Date();

      const dataToCreate = {
        ...payload,
        created_date: now,
        updated_date: now,
        ...(userId && { created_by: userId })
      };

      // Validate required fields
      this._validateRequired(dataToCreate);

      const doc = new this.model(dataToCreate);
      await doc.save();

      return {
        success: true,
        data: doc.toObject()
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update record with auto-fields
   */
  async update(id, payload, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${this.entityName} ID`);
        error.status = 400;
        throw error;
      }

      const now = new Date();

      const dataToUpdate = {
        ...payload,
        updated_date: now,
        ...(userId && { updated_by: userId })
      };

      const doc = await this.model.findByIdAndUpdate(
        id,
        dataToUpdate,
        { new: true, runValidators: true }
      ).lean();

      if (!doc) {
        const error = new Error(`${this.entityName} not found`);
        error.status = 404;
        throw error;
      }

      return {
        success: true,
        data: doc
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Delete record
   */
  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${this.entityName} ID`);
        error.status = 400;
        throw error;
      }

      const doc = await this.model.findByIdAndDelete(id).lean();

      if (!doc) {
        const error = new Error(`${this.entityName} not found`);
        error.status = 404;
        throw error;
      }

      return {
        success: true,
        message: `${this.entityName} deleted successfully`,
        data: doc
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Batch delete
   */
  async deleteBatch(ids) {
    try {
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

      const result = await this.model.deleteMany({
        _id: { $in: validIds }
      });

      return {
        success: true,
        message: `${result.deletedCount} records deleted`,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Count records matching filter
   */
  async count(filters = {}) {
    try {
      const query = this._buildQuery(filters);
      const count = await this.model.countDocuments(query);

      return {
        success: true,
        count
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Build MongoDB query from filters
   */
  _buildQuery(filters) {
    const query = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      // Handle different filter types
      if (typeof value === 'string') {
        // Case-insensitive partial match
        query[key] = { $regex: value, $options: 'i' };
      } else if (Array.isArray(value)) {
        // Array match (e.g., branch in ['CSE', 'ECE'])
        query[key] = { $in: value };
      } else if (typeof value === 'object' && value.$gt) {
        // Range queries
        query[key] = value;
      } else {
        // Exact match
        query[key] = value;
      }
    });

    return query;
  }

  /**
   * Validate required fields (subclass should override)
   */
  _validateRequired(data) {
    // Override in child classes or service instances
  }

  /**
   * Handle errors consistently
   */
  _handleError(error) {
    if (error.status) {
      return error;
    }

    if (error.name === 'ValidationError') {
      const validationError = new Error('Validation failed');
      validationError.status = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      return validationError;
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const duplicateError = new Error(`${field} must be unique`);
      duplicateError.status = 400;
      return duplicateError;
    }

    error.status = error.status || 500;
    return error;
  }
}

module.exports = EntityService;
