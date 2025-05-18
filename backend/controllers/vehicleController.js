import Vehicle from '../models/vehicle.js';

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
        const vehicles = await Vehicle.findAll({ where: { userId: req.user.userId } });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const deleted = await Vehicle.destroy({ where: { id: req.params.id, userId: req.user.userId } });
        if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
