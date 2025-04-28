import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    electionType: { type: String, enum: ["general", "provincial"], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["upcoming", "ongoing", "ended"], default: "upcoming" },
    isActive: { type: Boolean, default: true },
});

export default mongoose.model("Election", electionSchema);
