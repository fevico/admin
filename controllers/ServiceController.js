const BaseController = require('./BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const { Op } = require('sequelize');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class ServiceController extends BaseController {
  static async getTotalCountForSp(req, res) {
    try {
      const db = req.app.get('db').sequelize;
      const countQuery = `SELECT COUNT(*) as count FROM users WHERE type = 'SP' AND deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });

      const response = {
        totalServiceProviders: countResult.count,
      };

      return requestHandler.sendSuccess(res, 'Total service providers count fetched successfully', 200, response);
    } catch (error) {
      console.error('Error fetching total counts:', error);
      return requestHandler.sendError(res, 'An error occurred while fetching total counts', 500);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const db = req.app.get('db').sequelize;

      const usersQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                         FROM users 
                         WHERE deleted_at IS NULL`;
      const users = await db.query(usersQuery, { type: db.QueryTypes.SELECT });

      const countQuery = `SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });

      const response = {
        totalUsers: countResult.count,
        users,
      };

      requestHandler.sendSuccess(res, 'Users fetched successfully', 200);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      return requestHandler.sendError(res, 'An error occurred while fetching users', 500);
    }
  }

  static async getAllCustomers(req, res) {
    try {
      const db = req.app.get('db').sequelize;

      const customersQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                             FROM users 
                             WHERE type = 'customer' AND deleted_at IS NULL`;
      const customers = await db.query(customersQuery, { type: db.QueryTypes.SELECT });

      const countQuery = `SELECT COUNT(*) as count FROM users WHERE type = 'customer' AND deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });

      const response = {
        totalCustomers: countResult.count,
        customers,
      };

      requestHandler.sendSuccess(res, 'Customers fetched successfully', 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching customers:', error);
      return requestHandler.sendError(res, 'An error occurred while fetching customers', 500);
    }
  }

  static async getAllServiceProviders(req, res) {
    try {
      const db = req.app.get('db').sequelize;

      const spQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                       FROM users 
                       WHERE type = 'SP' AND deleted_at IS NULL`;
      const serviceProviders = await db.query(spQuery, { type: db.QueryTypes.SELECT });

      const countQuery = `SELECT COUNT(*) as count FROM users WHERE type = 'SP' AND deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });

      const response = {
        totalServiceProviders: countResult.count,
        serviceProviders,
      };

     requestHandler.sendSuccess(res, 'Service Providers fetched successfully');
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      return requestHandler.sendError(res, 'An error occurred while fetching service providers', 500);
    }
  }
}

module.exports = ServiceController;