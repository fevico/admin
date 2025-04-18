const router = require("express").Router();
const AuthController = require("../../controllers/AuthController");
const UserController = require("../../controllers/UsersController");
const ServiceController = require("../../controllers/ServiceController")
const authenticate = require("../../middleware/authenticate");
const auth = require("../../utils/auth");
const UsersController = require("../../controllers/UsersController");

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: The login credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - phone
 *             - password
 *           properties:
 *             phone:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: The refresh token
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - refreshToken
 *           properties:
 *             refreshToken:
 *               type: string
 *     responses:
 *       200:
 *         description: A new JWT token with a new expiry date is issued
 */
router.post("/refreshToken", auth.isAuthunticated, AuthController.refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: platform
 *         description: Device platform
 *         in: header
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: The FCM token of the current logged-in user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - fcmToken
 *           properties:
 *             fcmToken:
 *               type: string
 *     responses:
 *       200:
 *         description: Logged out from the application
 */
router.post("/logout", auth.isAuthunticated, AuthController.logOut);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User details to create a new user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstname
 *             - lastname
 *             - email
 *             - password
 *             - type
 *             - phone
 *           properties:
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *             phone:
 *               type: string
 *             phone_code:
 *               type: string
 *             type:
 *               type: string
 *               enum:
 *                 - sp
 *                 - admin
 *                 - customer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request (validation errors)
 *       403:
 *         description: Unauthorized (only super-admin can create users)
 */
router.post("/admin/users", auth.isAuthunticated, UserController.createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     description: Get user details by user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to fetch
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     uniq_id: 
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phone:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum:
 *                         - user
 *                         - admin
 *                         - super_admin
 *                         - customer
 *       400:
 *         description: Invalid user ID (validation errors)
 *       403:
 *         description: Unauthorized (only authenticated users can access)
 *       404:
 *         description: User not found
 */
router.get(
  "/admin/users/:id",
  auth.isAuthunticated,
  UserController.getUserById
);

/**
 * @swagger
 * /admin/users/{id}/delete:
 *   delete:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Unique ID of the user to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Unauthorized
 */

router.delete(
  "/admin/users/:id/delete",
  auth.isAuthunticated,
  UserController.deleteById
);

/**
 * @swagger
 * /admin/users/{id}/update:
 *   put:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         description: User details to update a user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstname
 *             - lastname
 *           properties:
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request (validation errors)
 *       403:
 *         description: Unauthorized (only super-admin can update users)
 *       404:
 *         description: User not found
 */
router.put(
  "/admin/users/:id/update",
  auth.isAuthunticated,
  UserController.UpdateUsers
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     description: Get all users with pagination
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Number of users per page
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       400:
 *         description: Bad request (validation errors)
 *       403:
 *         description: Unauthorized (only super-admin can access)
 *       404:
 *         description: No users found
 * */


router.get("/admin/users", auth.isAuthunticated, UserController.fetchAllUsers);

/**
 * @swagger
 * /service/counts/sp:
 *   get:
 *     tags:
 *       - Service Counts
 *     security:
 *       - Bearer: []
 *     summary: Get total count of service requests by status
 *     description: Returns the total count of service requests grouped by status (DEAL, PENDING, NEGOTIATE, ACCEPTED, REJECTED).
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully fetched total counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DEAL:
 *                   type: integer
 *                 PENDING:
 *                   type: integer
 *                 NEGOTIATE:
 *                   type: integer
 *                 ACCEPTED:
 *                   type: integer
 *                 REJECTED:
 *                   type: integer
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: Unauthorized (only authenticated users can access)
 *       500:
 *         description: An error occurred while fetching total counts
 */

router.get("/service/counts/sp",auth.isAuthunticated, ServiceController.getTotalCountForSp);
/**
 * @swagger
 * /service/counts/job:
 *   get:
 *     summary: Get total count of jobs by status
 *     description: Returns the total count of jobs grouped by status (Pending, in-progress, in-dispute, cancelled, Done, Completed).
 *     tags: [Job Counts]
 *     responses:
 *       200:
 *         description: Successfully fetched total counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Pending:
 *                   type: integer
 *                 in-progress:
 *                   type: integer
 *                 in-dispute:
 *                   type: integer
 *                 cancelled:
 *                   type: integer
 *                 Done:
 *                   type: integer
 *                 Completed:
 *                   type: integer
 *       500:
 *         description: An error occurred while fetching total counts
 */
// router.get("/service/counts/job",auth.isAuthunticated, ServiceController.getTotalCountForJob);
router.get('/jobs/:user_id', auth.isAuthunticated, UsersController.listOfJobsById);
/**
 * @swagger
 * /service-requests/{user_id}:
 *   get:
 *     tags:
 *       - Service Requests
 *     security:
 *       - Bearer: []
 *     description: Get a list of service requests by user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the user whose service requests are being retrieved
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: User not found or no service requests available
 *       403:
 *         description: Unauthorized (only authenticated users can access)
 */
router.get('/service-requests/:user_id',auth.isAuthunticated, UsersController.listOfServiceRequestById);

/**
 * @swagger
 * /jobs/{user_id}:
 *   get:
 *     tags:
 *       - Jobs
 *     security:
 *       - Bearer: []
 *     description: Get a list of jobs by user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the user whose jobs are being retrieved
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: User not found or no jobs available
 *       403:
 *         description: Unauthorized (only authenticated users can access)
 */
router.get('/jobs/:user_id',auth.isAuthunticated, UsersController.listOfJobsById);

/**
 * @swagger
 * /reset-password/{uniq_id}:
 *   post:
 *     tags:
 *       - Password Reset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uniq_id
 *         in: path
 *         description: Unique ID of the account for which the password is being reset
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: New password details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - newPassword
 *           properties:
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request (validation errors)
 *       404:
 *         description: User not found or invalid unique ID
 */
router.post('/reset-password/:uniq_id',auth.isAuthunticated, UsersController.accountReset);



module.exports = router;
