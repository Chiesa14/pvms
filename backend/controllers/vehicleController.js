import Vehicle from '../models/vehicle.js';

export const registerVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle({ ...req.body, owner: req.user.id });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.user.id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
