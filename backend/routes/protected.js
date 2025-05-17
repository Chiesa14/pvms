import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMidleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/protected/admin:
 *   get:
 *     summary: Access admin protected route
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome, admin!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome, admin!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});

/**
 * @swagger
 * /api/protected/staff:
 *   get:
 *     summary: Access staff protected route
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome, staff member!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome, staff member!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/staff', authenticateToken, authorizeRoles('staff'), (req, res) => {
    res.json({ message: 'Welcome, staff member!' });
});

export default router;
