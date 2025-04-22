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
  
      // Fetch all users
      const usersQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                         FROM users 
                         WHERE deleted_at IS NULL`;
      const users = await db.query(usersQuery, { type: db.QueryTypes.SELECT });
  
      // Total users count
      const countQuery = `SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });
  
      // Users registered today
      const todayQuery = `SELECT COUNT(*) as count 
                         FROM users 
                         WHERE deleted_at IS NULL 
                           AND DATE(created_at) = CURDATE()`;
      const [todayResult] = await db.query(todayQuery, { type: db.QueryTypes.SELECT });
  
      // Users registered in the last 7 days
      const last7DaysQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE deleted_at IS NULL 
                               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
      const [last7DaysResult] = await db.query(last7DaysQuery, { type: db.QueryTypes.SELECT });
  
      // Users registered this month
      const thisMonthQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE deleted_at IS NULL 
                               AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`;
      const [thisMonthResult] = await db.query(thisMonthQuery, { type: db.QueryTypes.SELECT });
  
      // Users registered this year
      const thisYearQuery = `SELECT COUNT(*) as count 
                            FROM users 
                            WHERE deleted_at IS NULL 
                              AND created_at >= DATE_FORMAT(CURDATE(), '%Y-01-01')`;
      const [thisYearResult] = await db.query(thisYearQuery, { type: db.QueryTypes.SELECT });
  
      // Build the response
      const response = {
        totalUsers: countResult.count,
        usersRegisteredToday: todayResult.count,
        usersRegisteredLast7Days: last7DaysResult.count,
        usersRegisteredThisMonth: thisMonthResult.count,
        usersRegisteredThisYear: thisYearResult.count,
        users,
      };
  
      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: `An error occurred while fetching users: ${error.message}` });
    }
  }

  static async getAllCustomers(req, res) {
    try {
      const db = req.app.get('db').sequelize;
  
      // Fetch all customers
      const customersQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                             FROM users 
                             WHERE type = 'customer' AND deleted_at IS NULL`;
      const customers = await db.query(customersQuery, { type: db.QueryTypes.SELECT });
  
      // Total customers count
      const countQuery = `SELECT COUNT(*) as count 
                         FROM users 
                         WHERE type = 'customer' AND deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });
  
      // Customers registered today
      const todayQuery = `SELECT COUNT(*) as count 
                         FROM users 
                         WHERE type = 'customer' AND deleted_at IS NULL 
                           AND DATE(created_at) = CURDATE()`;
      const [todayResult] = await db.query(todayQuery, { type: db.QueryTypes.SELECT });
  
      // Customers registered in the last 7 days
      const last7DaysQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE type = 'customer' AND deleted_at IS NULL 
                               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
      const [last7DaysResult] = await db.query(last7DaysQuery, { type: db.QueryTypes.SELECT });
  
      // Customers registered this month
      const thisMonthQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE type = 'customer' AND deleted_at IS NULL 
                               AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`;
      const [thisMonthResult] = await db.query(thisMonthQuery, { type: db.QueryTypes.SELECT });
  
      // Customers registered this year
      const thisYearQuery = `SELECT COUNT(*) as count 
                            FROM users 
                            WHERE type = 'customer' AND deleted_at IS NULL 
                              AND created_at >= DATE_FORMAT(CURDATE(), '%Y-01-01')`;
      const [thisYearResult] = await db.query(thisYearQuery, { type: db.QueryTypes.SELECT });
  
      // Build the response
      const response = {
        totalCustomers: countResult.count,
        customersRegisteredToday: todayResult.count,
        customersRegisteredLast7Days: last7DaysResult.count,
        customersRegisteredThisMonth: thisMonthResult.count,
        customersRegisteredThisYear: thisYearResult.count,
        customers,
      };
  
      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
      res.status(500).json({ error: `An error occurred while fetching customers: ${error.message}` });
    }
  }

  static async getAllServiceProviders(req, res) {
    try {
      const db = req.app.get('db').sequelize;
  
      // Fetch all admins
      const spQuery = `SELECT id, type, firstname, lastname, email, phone, created_at 
                         FROM users 
                         WHERE type = 'SP' AND deleted_at IS NULL`;
      const serviceProvider = await db.query(spQuery, { type: db.QueryTypes.SELECT });
  
      // Total admins count
      const countQuery = `SELECT COUNT(*) as count 
                         FROM users 
                         WHERE type = 'SP' AND deleted_at IS NULL`;
      const [countResult] = await db.query(countQuery, { type: db.QueryTypes.SELECT });
  
      // Service provider registered today
      const todayQuery = `SELECT COUNT(*) as count 
                         FROM users 
                         WHERE type = 'SP' AND deleted_at IS NULL 
                           AND DATE(created_at) = CURDATE()`;
      const [todayResult] = await db.query(todayQuery, { type: db.QueryTypes.SELECT });
  
      // Service provider in the last 7 days
      const last7DaysQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE type = 'SP' AND deleted_at IS NULL 
                               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
      const [last7DaysResult] = await db.query(last7DaysQuery, { type: db.QueryTypes.SELECT });
  
      // Service provider this month
      const thisMonthQuery = `SELECT COUNT(*) as count 
                             FROM users 
                             WHERE type = 'SP' AND deleted_at IS NULL 
                               AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`;
      const [thisMonthResult] = await db.query(thisMonthQuery, { type: db.QueryTypes.SELECT });
  
      // Service provider this year
      const thisYearQuery = `SELECT COUNT(*) as count 
                            FROM users 
                            WHERE type = 'SP' AND deleted_at IS NULL 
                              AND created_at >= DATE_FORMAT(CURDATE(), '%Y-01-01')`;
      const [thisYearResult] = await db.query(thisYearQuery, { type: db.QueryTypes.SELECT });
  
      // Build the response
      const response = {
        totalSP: countResult.count,
        spRegisteredToday: todayResult.count,
        spRegisteredLast7Days: last7DaysResult.count,
        spRegisteredThisMonth: thisMonthResult.count,
        spRegisteredThisYear: thisYearResult.count,
        serviceProvider: serviceProvider,
      };
  
      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching admins:', error.message);
      res.status(500).json({ error: `An error occurred while fetching admins: ${error.message}` });
    }
  }
}

module.exports = ServiceController;