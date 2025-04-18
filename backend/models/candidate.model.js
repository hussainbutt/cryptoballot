// backend/models/Candidate.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    cnic: { type: String },
    halqa: { type: String, required: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", default: null },
    symbol: { type: String }, // URL for Cloudinary or inherited from party ya phir independent candidate apni uri de ga
    election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
});

export default mongoose.model("Candidate", candidateSchema);
