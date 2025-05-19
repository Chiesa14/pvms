import ParkingSlot from '../models/ParkingSlot.js';
import {
    createPaginationOptions,
    createWhereClause,
    createPaginationResponse
} from '../utils/pagination.js';

export const createSlot = async (req, res) => {
    try {
        const { slotNumber, floor, type, status } = req.body;

        // Validate required fields
        if (!slotNumber) {
            return res.status(400).json({ error: 'Slot number is required' });
        }

        // Create the slot with the provided data
        const slot = await ParkingSlot.create({
            slotNumber,
            floor,
            type,
            status: status || 'available'
        });

        res.status(201).json(slot);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Slot number must be unique' });
        }
        res.status(400).json({ error: error.message });
    }
};

export const getAllSlots = async (req, res) => {
    try {
        const { page, limit, offset } = createPaginationOptions(req.query);

        const where = createWhereClause(req.query, {
            searchFields: ['slotNumber', 'floor', 'type'],
            statusField: 'status'
        });

        const { count, rows } = await ParkingSlot.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json(createPaginationResponse(count, page, limit, rows));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch parking slots' });
    }
};

export const getSlotById = async (req, res) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }
        res.json(slot);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch parking slot' });
    }
};

export const updateSlot = async (req, res) => {
    try {
        const { slotNumber, floor, type, status } = req.body;
        const slot = await ParkingSlot.findByPk(req.params.id);

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        // Update the slot
        await slot.update({
            slotNumber,
            floor,
            type,
            status
        });

        res.json(slot);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Slot number must be unique' });
        }
        res.status(400).json({ error: error.message });
    }
};

export const deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        await slot.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete parking slot' });
    }
};
