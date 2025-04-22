const router = require("express").Router();
const ServiceController = require("../../controllers/ServiceController");
const auth = require("../../utils/auth");  

/**
 * @swagger
 * /service/all/users:
 *   get:
 *     tags:
 *       - Service
 *     summary: Fetch all users
 *     description: Retrieves a list of all non-deleted users with their details and total count. Requires authentication.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indicates if the request was successful
 *             message:
 *               type: string
 *               description: Response message
 *             data:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of users
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique user ID
 *                       type:
 *                         type: string
 *                         description: User type (e.g., 'customer', 'SP')
 *                       firstname:
 *                         type: string
 *                         description: User's first name
 *                       lastname:
 *                         type: string
 *                         description: User's last name
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                       phone:
 *                         type: string
 *                         description: User's phone number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: User creation timestamp
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/all/users", ServiceController.getAllUsers);

/**
 * @swagger
 * /service/service/total:
 *   get:
 *     tags:
 *       - Service
 *     summary: Fetch total service providers count
 *     description: Retrieves the total count of non-deleted service providers (type 'SP'). Requires authentication.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json 
 *     responses:
 *       200:
 *         description: Total service providers count fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indicates if the request was successful
 *             message:
 *               type: string
 *               description: Response message
 *             data:
 *               type: object
 *               properties:
 *                 totalServiceProviders:
 *                   type: integer
 *                   description: Total number of service providers
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/total", ServiceController.getTotalCountForSp);

/**
 * @swagger
 * /service/customers:
 *   get:
 *     tags:
 *       - Service
 *     summary: Fetch all customers
 *     description: Retrieves a list of non-deleted users with type 'customer' and total count. Requires authentication.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Customers fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indicates if the request was successful
 *             message:
 *               type: string
 *               description: Response message
 *             data:
 *               type: object
 *               properties:
 *                 totalCustomers:
 *                   type: integer
 *                   description: Total number of customers
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique user ID
 *                       type:
 *                         type: string
 *                         description: User type ('customer')
 *                       firstname:
 *                         type: string
 *                         description: User's first name
 *                       lastname:
 *                         type: string
 *                         description: User's last name
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                       phone:
 *                         type: string
 *                         description: User's phone number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: User creation timestamp
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/customers", ServiceController.getAllCustomers);

/**
 * @swagger
 * /service/service/provider:
 *   get:
 *     tags:
 *       - Service
 *     summary: Fetch all service providers
 *     description: Retrieves a list of non-deleted users with type 'SP' (service provider) and total count. Requires authentication.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Service providers fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indicates if the request was successful
 *             message:
 *               type: string
 *               description: Response message
 *             data:
 *               type: object
 *               properties:
 *                 totalServiceProviders:
 *                   type: integer
 *                   description: Total number of service providers
 *                 serviceProviders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique user ID
 *                       type:
 *                         type: string
 *                         description: User type ('SP')
 *                       firstname:
 *                         type: string
 *                         description: User's first name
 *                       lastname:
 *                         type: string
 *                         description: User's last name
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                       phone:
 *                         type: string
 *                         description: User's phone number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: User creation timestamp
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/service/provider", ServiceController.getAllServiceProviders);

module.exports = router;
