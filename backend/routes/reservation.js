import express from 'express';
import { createReservation, getUserReservations, cancelReservation } from '../controllers/reservationController.js';
import { authenticateToken } from '../middleware/authMidleware.js';

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

export default router;
