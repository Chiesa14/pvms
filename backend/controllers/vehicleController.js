import Vehicle from '../models/vehicle.js';
import {
    createPaginationOptions,
    createWhereClause,
    createPaginationResponse
} from '../utils/pagination.js';

export const registerVehicle = async (req, res) => {
    try {
        const { licensePlate, type, brand, model, color } = req.body;
        const vehicle = await Vehicle.create({
            userId: req.user.userId,
            licensePlate,
            type,
            brand,
            model,
            color,
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyVehicles = async (req, res) => {
    try {
        const { page, limit, offset } = createPaginationOptions(req.query);

        const where = createWhereClause(req.query, {
            searchFields: ['licensePlate', 'brand', 'model', 'color'],
            statusField: 'type'
        });

        where.userId = req.user.userId;

        const { count, rows } = await Vehicle.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json(createPaginationResponse(count, page, limit, rows));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllVehicles = async (req, res) => {
    try {
        const { page, limit, offset } = createPaginationOptions(req.query);

        const where = createWhereClause(req.query, {
            searchFields: ['licensePlate', 'brand', 'model', 'color'],
            statusField: 'type'
        });

        const { count, rows } = await Vehicle.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: ['user'] // Include user details if you have the association
        });

        res.json(createPaginationResponse(count, page, limit, rows));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: ['user'] // Include user details if you have the association
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const { licensePlate, type, brand, model, color } = req.body;
        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id, userId: req.user.userId }
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        await vehicle.update({
            licensePlate,
            type,
            brand,
            model,
            color
        });

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const deleted = await Vehicle.destroy({
            where: { id: req.params.id, userId: req.user.userId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
