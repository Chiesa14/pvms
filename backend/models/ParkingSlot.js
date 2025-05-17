import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['car', 'bike', 'handicap', 'electric'],
      default: 'car',
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

export default ParkingSlot;
