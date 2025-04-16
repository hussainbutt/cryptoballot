// models/election.model.js
import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        electionType: {
            type: String,  // For example, "General", "Local", etc.
            required: true,
        },
        status: {
            type: String,  // "Active", "Completed", "Upcoming"
            default: "Upcoming",
        },
    },
    { timestamps: true }  // This will automatically manage createdAt and updatedAt fields
);

const Election = mongoose.model("Election", electionSchema);

export default Election;
