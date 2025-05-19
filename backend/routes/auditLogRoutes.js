import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMidleware.js';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Get all audit logs with pagination
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', auditLogController.getAllLogs);

/**
 * @swagger
 * /api/audit-logs/table/{tableName}:
 *   get:
 *     summary: Get audit logs for a specific table
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the table
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of audit logs for the specified table
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/table/:tableName', auditLogController.getTableLogs);

/**
 * @swagger
 * /api/audit-logs/record/{tableName}/{recordId}:
 *   get:
 *     summary: Get audit logs for a specific record
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the table
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the record
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of audit logs for the specified record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/record/:tableName/:recordId', auditLogController.getRecordLogs);

/**
 * @swagger
 * /api/audit-logs/search:
 *   get:
 *     summary: Search audit logs with filters
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tableName
 *         schema:
 *           type: string
 *         description: Filter by table name
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [INSERT, UPDATE, DELETE]
 *         description: Filter by action type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Filtered list of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/search', auditLogController.searchLogs);

export default router; 