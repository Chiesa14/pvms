// routes/analytics.js
import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMidleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 120
 *                 totalVehicles:
 *                   type: integer
 *                   example: 250
 *                 totalReservations:
 *                   type: integer
 *                   example: 500
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                   example: 20450.50
 *                 occupancyRate:
 *                   type: string
 *                   example: "75%"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), getDashboardStats);

export default router;
