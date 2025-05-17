import express from 'express';
import {
    createSlot,
    getAllSlots,
    getSlotById,
    updateSlot,
    deleteSlot,
} from '../controllers/parkingSlotController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMidleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ParkingSlots
 *   description: Parking slot management
 */

/**
 * @swagger
 * /api/slots:
 *   get:
 *     summary: Get all parking slots
 *     tags: [ParkingSlots]
 *     responses:
 *       200:
 *         description: List of slots
 */
router.get('/', getAllSlots);

/**
 * @swagger
 * /api/slots:
 *   post:
 *     summary: Create a parking slot
 *     tags: [ParkingSlots]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, authorizeRoles('admin'), createSlot);

/**
 * @swagger
 * /api/slots/{id}:
 *   get:
 *     summary: Get a slot by ID
 *     tags: [ParkingSlots]
 */
router.get('/:id', getSlotById);

/**
 * @swagger
 * /api/slots/{id}:
 *   put:
 *     summary: Update a parking slot
 *     tags: [ParkingSlots]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateSlot);

/**
 * @swagger
 * /api/slots/{id}:
 *   delete:
 *     summary: Delete a parking slot
 *     tags: [ParkingSlots]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteSlot);

export default router;
