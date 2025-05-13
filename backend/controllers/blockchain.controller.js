import Vote from "../models/vote.model.js";
import { voteActor } from '../blockchain/icpClient.js';
import { hashVote } from "../utils/hashVote.js";

export const verifyVotes = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Get all votes for the election from database
        const votes = await Vote.find({ electionId });

        if (!votes.length) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        // Generate hashes for each vote
        const voteHashes = votes.map(vote => {
            return hashVote({
                voterId: vote.voterId.toString(),
                candidateId: vote.candidateId.toString(),
                electionId: vote.electionId.toString(),
                halqa: vote.halqa,
                voteTimestamp: vote.voteTimestamp
            });
        });

        // Verify votes on blockchain
        const verificationResult = await voteActor.verifyVotes(voteHashes);

        if (!verificationResult) {
            return res.status(404).json({ message: "Failed to verify votes on blockchain" });
        }

        // Check if all votes are valid
        const match = verificationResult.validCount === voteHashes.length;

        res.json({
            match,
            validCount: Number(verificationResult.validCount),
            corruptCount: Number(verificationResult.corruptCount),
            totalVotes: votes.length,
            details: votes.map((vote, index) => ({
                voteId: vote._id,
                voterId: vote.voterId,
                hash: voteHashes[index],
                verified: verificationResult.validCount > index
            }))
        });

    } catch (error) {
        console.error('Error verifying votes:', error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function to compare arrays of hashes
const compareHashes = (dbHashes, blockchainHashes) => {
    if (dbHashes.length !== blockchainHashes.length) {
        return false;
    }

    // Sort both arrays to ensure consistent comparison
    const sortedDbHashes = [...dbHashes].sort();
    const sortedBlockchainHashes = [...blockchainHashes].sort();

    // Compare each hash
    for (let i = 0; i < sortedDbHashes.length; i++) {
        if (sortedDbHashes[i] !== sortedBlockchainHashes[i]) {
            return false;
        }
    }

    return true;
};
