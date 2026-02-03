/**
 * Unified Entity Routes - Base44 Style
 * Generates CRUD routes for any entity
 */

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Create entity routes for CRUD operations
 * @param {EntityService} service - The entity service
 * @param {string} entityName - Name of the entity
 * @param {object} options - Route options
 */
function createEntityRoutes(service, entityName, options = {}) {
  const router = express.Router();
  
  const {
    readRequiresAuth = false,
    writeRequiresAdmin = true,
    readUserCanOnlySeeSelf = false,
    userIdField = 'user_id'
  } = options;

  /**
   * GET /entities/{entityName}/list
   * List all records with pagination
   */
  router.get('/list', readRequiresAuth ? authenticate : [], async (req, res) => {
    try {
      const { sort = '-created_date', page = 1, limit = 100 } = req.query;

      const result = await service.list(sort, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }
  });

  /**
   * POST /entities/{entityName}/filter
   * Filter records
   */
  router.post('/filter', readRequiresAuth ? authenticate : [], async (req, res) => {
    try {
      const { filters = {}, sort = '-created_date', page = 1, limit = 100 } = req.body;

      const result = await service.filter(filters, sort, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }
  });

  /**
   * GET /entities/{entityName}/:id
   * Get single record by ID
   */
  router.get('/:id', readRequiresAuth ? authenticate : [], async (req, res) => {
    try {
      if (readUserCanOnlySeeSelf && req.user && req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Can only view your own profile'
        });
      }

      const result = await service.getById(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }
  });

  /**
   * POST /entities/{entityName}/create
   * Create new record
   */
  const createMiddleware = writeRequiresAdmin ? [authenticate, authorize('admin')] : [authenticate];
  router.post('/create', 
    ...createMiddleware,
    async (req, res) => {
      try {
        const result = await service.create(req.body, req.user?.email);
        res.status(201).json(result);
      } catch (error) {
        res.status(error.status || 500).json({
          success: false,
          message: error.message,
          details: error.details
        });
      }
    }
  );

  /**
   * PUT /entities/{entityName}/:id
   * Update record
   */
  const updateMiddleware = writeRequiresAdmin ? [authenticate, authorize('admin')] : [authenticate];
  router.put('/:id',
    ...updateMiddleware,
    async (req, res) => {
      try {
        const result = await service.update(req.params.id, req.body, req.user?.email);
        res.json(result);
      } catch (error) {
        res.status(error.status || 500).json({
          success: false,
          message: error.message,
          details: error.details
        });
      }
    }
  );

  /**
   * DELETE /entities/{entityName}/:id
   * Delete record
   */
  const deleteMiddleware = writeRequiresAdmin ? [authenticate, authorize('admin')] : [authenticate];
  router.delete('/:id',
    ...deleteMiddleware,
    async (req, res) => {
      try {
        const result = await service.delete(req.params.id);
        res.json(result);
      } catch (error) {
        res.status(error.status || 500).json({
          success: false,
          message: error.message,
          details: error.details
        });
      }
    }
  );

  /**
   * DELETE /entities/{entityName}/batch
   * Batch delete records
   */
  const batchDeleteMiddleware = writeRequiresAdmin ? [authenticate, authorize('admin')] : [authenticate];
  router.post('/batch/delete',
    ...batchDeleteMiddleware,
    async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'ids must be a non-empty array'
          });
        }

        const result = await service.deleteBatch(ids);
        res.json(result);
      } catch (error) {
        res.status(error.status || 500).json({
          success: false,
          message: error.message,
          details: error.details
        });
      }
    }
  );

  /**
   * POST /entities/{entityName}/count
   * Count records matching filter
   */
  router.post('/count', readRequiresAuth ? authenticate : [], async (req, res) => {
    try {
      const { filters = {} } = req.body;
      const result = await service.count(filters);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }
  });

  return router;
}

module.exports = createEntityRoutes;
