import express from 'express';
import { authenticateToken } from '../middleware/authMidleware.js';
import { registerVehicle, getMyVehicles, deleteVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [licensePlate, type]
 *             properties:
 *               licensePlate:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [car, motorcycle, truck, bus]
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle registered
 */
router.post('/', authenticateToken, registerVehicle);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get vehicles owned by the logged-in user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', authenticateToken, getMyVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', authenticateToken, deleteVehicle);

export default router;
