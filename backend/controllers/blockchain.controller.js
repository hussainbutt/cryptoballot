import Vote from "../models/vote.model.js";
import { HttpAgent } from "@dfinity/agent";
import { Actor } from "@dfinity/agent";
import { idlFactory as voteIDL } from "../../path-to/.dfx/local/canisters/vote_verification/vote_verification.js";
import { canisterId as voteCanisterId } from "../../path-to/.dfx/local/canisters/vote_verification/vote_verification.js";
import crypto from "crypto";

// create agent
const agent = new HttpAgent({ host: "http://127.0.0.1:4943" }); // local replica
const voteCanister = Actor.createActor(voteIDL, {
    agent,
    canisterId: voteCanisterId,
});

const hashVote = (vote) => {
    const data = `${vote.voterId}-${vote.candidateId}-${vote.electionId}-${vote.halqa}`;
    return crypto.createHash("sha256").update(data).digest("hex");
};

export const verifyElectionVotes = async (req, res) => {
    const { electionId } = req.params;

    try {
        const votes = await Vote.find({ electionId });

        const hashes = votes.map((vote) => hashVote(vote));

        const result = await voteCanister.verifyVotes(hashes);

        res.status(200).json({
            totalVotes: hashes.length,
            validVotes: result.validCount,
            corruptVotes: result.corruptCount,
        });
    } catch (error) {
        console.error("Error verifying votes:", error);
        res.status(500).json({ message: "Failed to verify votes." });
    }
};
