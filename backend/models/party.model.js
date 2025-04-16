// models/Party.js
import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        symbol: {
            type: String,
            required: true,
        },
        leader: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Party = mongoose.model('Party', partySchema);

export default Party;
