import express from 'express';
import { createReservation, getUserReservations, cancelReservation, acknowledgeReservation, revokeReservation, getAllReservations } from '../controllers/reservationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMidleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slot, vehicleNumber, startTime, endTime]
 *             properties:
 *               slot:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slot already reserved
 */
router.post('/', authenticateToken, createReservation);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations for current user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get('/', authenticateToken, getUserReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', authenticateToken, cancelReservation);

/**
 * @swagger
 * /api/reservations/{id}/acknowledge:
 *   patch:
 *     summary: Admin acknowledge (approve) a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation acknowledged
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/acknowledge', authenticateToken, authorizeRoles('admin'), acknowledgeReservation);

/**
 * @swagger
 * /api/reservations/{id}/revoke:
 *   patch:
 *     summary: Admin revoke (reject) a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation revoked
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/revoke', authenticateToken, authorizeRoles('admin'), revokeReservation);

/**
 * @swagger
 * /api/reservations/all:
 *   get:
 *     summary: Get all reservations (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reservations with user and slot details
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllReservations);

export default router;
