const _ = require('lodash');
const Joi = require('joi');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require("../utils/logger");
const BaseController = require('./BaseController');

const SUPER_ADMIN = 'super-admin';
const ADMIN = 'admin';

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class PermissionsController extends BaseController {
  // Create a permission
  static async createPermission(req, res) {   
    try {
      const reqParam = req.body;

      // Joi validation schema
      const schema = {
        name: Joi.string().required().pattern(/^[a-z_]+$/).max(255),
        description: Joi.string().optional().max(255),
        role_names: Joi.array().items(Joi.string()).optional(),
        user_ids: Joi.array().items(Joi.number()).optional(),
      };

      // Validate request body
      const { error } = Joi.validate(reqParam, schema);
      if (error) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Invalid request data')
        );
      }

      // Check if permission exists
      const existingPermission = await super.getByCustomOptions(req, 'Permissions', {
        where: { name: reqParam.name },
      });
      if (existingPermission) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Permission with this name already exists')
        );
      }

      // Create permission
      const newPermission = await super.create(req, 'Permissions', {
        name: reqParam.name,
        description: reqParam.description,
        created_at: new Date(),
      });

      // Assign to roles if provided
      if (reqParam.role_names && reqParam.role_names.length > 0) {
        await super.create(req, 'role_permissions', reqParam.role_names.map((role_name) => ({
          permission_id: newPermission.id,
          role_name,
        })));
      }

      // Assign to users if provided
      if (reqParam.user_ids && reqParam.user_ids.length > 0) {
        await super.create(req, 'user_permissions', reqParam.user_ids.map((user_id) => ({
          permission_id: newPermission.id,
          id: user_id,
        })));
      }

      // Prepare response
      const response = _.omit(newPermission, ['deleted_at']);
      return requestHandler.sendSuccess(res, 'Permission created successfully')({ permission: response });
    } catch (error) {
      console.error('Error creating permission:', error);
      return requestHandler.sendError(req, res, error);
    }
  }

  // Get all permissions
  static async getAllPermissions(req, res) {
    try {
      const permissions = await super.getByCustomOptions(req, 'Permissions', {
        where: { deleted_at: null },
        include: [
          { model: 'Roles', through: 'role_permissions', attributes: ['roleName'] },
          { model: 'users', through: 'user_permissions', attributes: ['id', 'firstname', 'lastname'] },
        ],
      });

      return requestHandler.sendSuccess(res, 'Permissions fetched successfully')({ permissions });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return requestHandler.sendError(req, res, error);
    }
  }

  // Get a single permission by ID
  static async getPermission(req, res) {
    try {
      const permissionId = parseInt(req.params.id, 10);
      if (isNaN(permissionId)) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Invalid permission ID')
        );
      }

      const permission = await super.getByCustomOptions(req, 'Permissions', {
        where: { id: permissionId, deleted_at: null },
        include: [
          { model: 'Roles', through: 'role_permissions', attributes: ['roleName'] },
          { model: 'users', through: 'user_permissions', attributes: ['id', 'firstname', 'lastname'] },
        ],
      });

      if (!permission) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Permission not found')
        );
      }

      return requestHandler.sendSuccess(res, 'Permission fetched successfully')({ permission });
    } catch (error) {
      console.error('Error fetching permission:', error);
      return requestHandler.sendError(req, res, error);
    }
  }

  // Update a permission
  static async updatePermission(req, res) {
    try {
      const permissionId = parseInt(req.params.id, 10);
      const reqParam = req.body;

      if (isNaN(permissionId)) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Invalid permission ID')
        );
      }

      // Joi validation schema
      const schema = {
        name: Joi.string().optional().pattern(/^[a-z_]+$/).max(255),
        description: Joi.string().optional().max(255).allow(''),
        role_names: Joi.array().items(Joi.string()).optional(),
        user_ids: Joi.array().items(Joi.number()).optional(),
      };

      // Validate request body
      const { error } = Joi.validate(reqParam, schema);
      if (error) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Invalid request data')
        );
      }

      // Check if permission exists
      const permission = await super.getByCustomOptions(req, 'Permissions', {
        where: { id: permissionId, deleted_at: null },
      });
      if (!permission) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Permission not found')
        );
      }

      // Check if new name is taken
      if (reqParam.name && reqParam.name !== permission.name) {
        const existingPermission = await super.getByCustomOptions(req, 'Permissions', {
          where: { name: reqParam.name },
        });
        if (existingPermission) {
          return requestHandler.sendError(
            req,
            res,
            new Error('Permission with this name already exists')
          );
        }
      }

      // Update permission
      await super.update(req, 'Permissions', {
        where: { id: permissionId },
        data: {
          name: reqParam.name || permission.name,
          description: reqParam.description !== undefined ? reqParam.description : permission.description,
          updated_at: new Date(),
        },
      });

      // Update role associations
      if (reqParam.role_names) {
        await super.destroy(req, 'role_permissions', { where: { permission_id: permissionId } });
        if (reqParam.role_names.length > 0) {
          await super.create(req, 'role_permissions', reqParam.role_names.map((role_name) => ({
            permission_id: permissionId,
            role_name,
          })));
        }
      }

      // Update user associations
      if (reqParam.user_ids) {
        await super.destroy(req, 'user_permissions', { where: { permission_id: permissionId } });
        if (reqParam.user_ids.length > 0) {
          await super.create(req, 'user_permissions', reqParam.user_ids.map((user_id) => ({
            permission_id: permissionId,
            id: user_id,
          })));
        }
      }

      // Fetch updated permission
      const updatedPermission = await super.getByCustomOptions(req, 'Permissions', {
        where: { id: permissionId },
        include: [
          { model: 'Roles', through: 'role_permissions', attributes: ['roleName'] },
          { model: 'users', through: 'user_permissions', attributes: ['id', 'firstname', 'lastname'] },
        ],
      });

      return requestHandler.sendSuccess(res, 'Permission updated successfully')({ permission: updatedPermission });
    } catch (error) {
      console.error('Error updating permission:', error);
      return requestHandler.sendError(req, res, error);
    }
  }

  // Delete a permission (soft delete)
  static async deletePermission(req, res) {
    try {
      const permissionId = parseInt(req.params.id, 10);
      if (isNaN(permissionId)) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Invalid permission ID')
        );
      }

      // Check if permission exists
      const permission = await super.getByCustomOptions(req, 'Permissions', {
        where: { id: permissionId, deleted_at: null },
      });
      if (!permission) {
        return requestHandler.sendError(
          req,
          res,
          new Error('Permission not found')
        );
      }

      // Soft delete permission
      await super.update(req, 'Permissions', {
        where: { id: permissionId },
        data: { deleted_at: new Date() },
      });

      return requestHandler.sendSuccess(res, 'Permission deleted successfully')({});
    } catch (error) {
      console.error('Error deleting permission:', error);
      return requestHandler.sendError(req, res, error);
    }
  }
};

module.exports = PermissionsController;