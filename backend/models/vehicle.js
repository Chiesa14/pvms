import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['car', 'motorcycle', 'truck', 'bus'],
        required: true,
    },
    brand: { type: String },
    model: { type: String },
    color: { type: String },
}, {
    timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
