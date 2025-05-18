import ParkingSlot from '../models/ParkingSlot.js';

export const createSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.create(req.body);
        res.status(201).json(slot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllSlots = async (req, res) => {
    const slots = await ParkingSlot.findAll();
    res.json(slots);
};

export const getSlotById = async (req, res) => {
    const slot = await ParkingSlot.findByPk(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    res.json(slot);
};

export const updateSlot = async (req, res) => {
    const [updatedRows, [updated]] = await ParkingSlot.update(req.body, {
        where: { id: req.params.id },
        returning: true,
    });
    res.json(updated);
};

export const deleteSlot = async (req, res) => {
    await ParkingSlot.destroy({ where: { id: req.params.id } });
    res.status(204).end();
};
