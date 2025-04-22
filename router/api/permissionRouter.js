const router = require("express").Router();
const permissionController = require("../../controllers/PermissionsController");
const auth = require("../../utils/auth");
const isAdmin = require("../../utils/auth")

// Admin-only routes
router.post("/", auth, permissionController.createPermission);
router.get("/", auth, permissionController.getAllPermissions);
router.get("/:id", auth, permissionController.getPermission);
router.patch("/:id", auth, permissionController.updatePermission);
router.delete("/:id", auth, permissionController.deletePermission);

/**
 * @swagger
 * /permission:
 *   post:
 *     tags:
 *       - Permissions
 *     summary: Create a new permission
 *     description: Allows an admin to create a permission with optional role and user associations. Permission name must be unique and lowercase with underscores (e.g., view_users).
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Permission data to create a new permission
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               description: Unique permission name (lowercase, underscores, e.g., view_users)
 *               example: view_users
 *             description:
 *               type: string
 *               description: Permission description (optional)
 *               example: View user profiles
 *             role_names:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of role names to assign the permission (optional)
 *               example: ["admin", "manager"]
 *             user_ids:
 *               type: array
 *               items:
 *                 type: integer
 *               description: List of user IDs to assign the permission (optional)
 *               example: [1, 2]
 *           additionalProperties: false
 *     responses:
 *       200:
 *         description: Permission created successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Permission created successfully
 *             data:
 *               type: object
 *               properties:
 *                 permission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: view_users
 *                     description:
 *                       type: string
 *                       example: View user profiles
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:00:00.000Z
 *       400:
 *         description: Validation error or permission already exists
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Invalid request data
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                     example: Invalid value
 *                   param:
 *                     type: string
 *                     example: name
 *                   value:
 *                     type: string
 *                     example: invalid@name
 *               example: []
 *       403:
 *         description: Access denied (non-admin user)
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Access denied. Admin privileges required.
 *       500:
 *         description: Server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: An error occurred while creating the permission
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get all permissions
 *     description: Retrieves a list of all active permissions with their associated roles and users.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Permissions fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: view_users
 *                       description:
 *                         type: string
 *                         example: View user profiles
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-17T12:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-17T12:00:00.000Z
 *                       Roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             roleName:
 *                               type: string
 *                               example: admin
 *                         example: [{ "roleName": "admin" }, { "roleName": "manager" }]
 *                       users:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             firstname:
 *                               type: string
 *                               example: John
 *                             lastname:
 *                               type: string
 *                               example: Doe
 *                         example: [{ "id": 1, "firstname": "John", "lastname": "Doe" }]
 *       403:
 *         description: Access denied (non-admin user)
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Access denied. Admin privileges required.
 *       500:
 *         description: Server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: An error occurred while fetching permissions
 *
 * /permission/{id}:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get a permission by ID
 *     description: Retrieves a single permission by ID with its associated roles and users.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the permission to retrieve
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Permission fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Permission fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 permission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: view_users
 *                     description:
 *                       type: string
 *                       example: View user profiles
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:00:00.000Z
 *                     Roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           roleName:
 *                             type: string
 *                             example: admin
 *                       example: [{ "roleName": "admin" }]
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           firstname:
 *                             type: string
 *                             example: John
 *                           lastname:
 *                             type: string
 *                             example: Doe
 *                       example: [{ "id": 1, "firstname": "John", "lastname": "Doe" }]
 *       400:
 *         description: Invalid permission ID
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Invalid permission ID
 *       404:
 *         description: Permission not found
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Permission not found
 *       403:
 *         description: Access denied (non-admin user)
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Access denied. Admin privileges required.
 *       500:
 *         description: Server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: An error occurred while fetching the permission
 *   patch:
 *     tags:
 *       - Permissions
 *     summary: Update a permission
 *     description: Allows an admin to update a permission's name, description, and associations.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the permission to update
 *         required: true
 *         type: integer
 *       - in: body
 *         name: body
 *         description: Permission data to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: New permission name (optional, must be unique)
 *               example: edit_users
 *             description:
 *               type: string
 *               description: New permission description (optional)
 *               example: Edit user profiles
 *             role_names:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of role names to assign the permission (optional)
 *               example: ["super-admin"]
 *             user_ids:
 *               type: array
 *               items:
 *                 type: integer
 *               description: List of user IDs to assign the permission (optional)
 *               example: [3]
 *           additionalProperties: false
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Permission updated successfully
 *             data:
 *               type: object
 *               properties:
 *                 permission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: edit_users
 *                     description:
 *                       type: string
 *                       example: Edit user profiles
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-17T12:01:00.000Z
 *                     Roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           roleName:
 *                             type: string
 *                             example: super-admin
 *                       example: [{ "roleName": "super-admin" }]
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           firstname:
 *                             type: string
 *                             example: Jane
 *                           lastname:
 *                             type: string
 *                             example: Smith
 *                       example: [{ "id": 3, "firstname": "Jane", "lastname": "Smith" }]
 *       400:
 *         description: Validation error or permission already exists
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Invalid request data
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                   param:
 *                     type: string
 *                   value:
 *                     type: string
 *               example: []
 *       404:
 *         description: Permission not found
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Permission not found
 *       403:
 *         description: Access denied (non-admin user)
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Access denied. Admin privileges required.
 *       500:
 *         description: Server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: An error occurred while updating the permission
 *   delete:
 *     tags:
 *       - Permissions
 *     summary: Delete a permission
 *     description: Soft deletes a permission by ID. Only admins can perform this action.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the permission to delete
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Permission deleted successfully
 *             data:
 *               type: object
 *               example: {}
 *       400:
 *         description: Invalid permission ID
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Invalid permission ID
 *       404:
 *         description: Permission not found
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Permission not found
 *       403:
 *         description: Access denied (non-admin user)
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Access denied. Admin privileges required.
 *       500:
 *         description: Server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: An error occurred while deleting the permission
 * definitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

module.exports = router;