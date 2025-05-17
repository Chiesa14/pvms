import ParkingSlot from '../models/ParkingSlot.js';

export const createSlot = async (req, res) => {
    try {
        const slot = new ParkingSlot(req.body);
        await slot.save();
        res.status(201).json(slot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllSlots = async (req, res) => {
    const slots = await ParkingSlot.find().populate('reservedBy', 'username email');
    res.json(slots);
};

export const getSlotById = async (req, res) => {
    const slot = await ParkingSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    res.json(slot);
};

export const updateSlot = async (req, res) => {
    const updated = await ParkingSlot.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
};

export const deleteSlot = async (req, res) => {
    await ParkingSlot.findByIdAndDelete(req.params.id);
    res.status(204).end();
};
