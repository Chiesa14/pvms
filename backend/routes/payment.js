import express from 'express';
import { authenticateToken } from '../middleware/authMidleware.js';
import { initiatePayment } from '../controllers/paymentController.js';
import { verifyPayment } from '../controllers/paymentController.js';


const router = express.Router();

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: Initiate a payment for a reservation
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - paymentMethod
 *             properties:
 *               reservationId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, mobile_money, cash]
 *     responses:
 *       200:
 *         description: Payment processed
 *       400:
 *         description: Bad request or already paid
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.post('/initiate', authenticateToken, initiatePayment);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify a payment by transaction ID
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPaymentInput'
 *     responses:
 *       200:
 *         description: Payment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post('/verify', verifyPayment);


export default router;
