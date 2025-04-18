import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voter", // Reference to the Voter model
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate", // Reference to the Candidate model
        required: true,
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election", // Reference to the Election model
        required: true,
    },
    halqa: {
        type: String, // Electoral area or region (e.g., NA, PP)
        required: true,
    },
    voteTimestamp: {
        type: Date, // Date when the vote was cast
        default: Date.now,
    },
});

export default mongoose.model("Vote", voteSchema);
