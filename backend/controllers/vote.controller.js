import { hashVote } from "../utils/hashVote.js";
import { voteActor } from "../blockchain/icpClient.js"; // Make sure this is correct
import Voter from "../models/user.model.js";
import Election from "../models/election.model.js";
import Candidate from "../models/candidate.model.js";
import Vote from "../models/vote.model.js";

// GET /api/vote/candidates?voterId=...&electionId=...
export const fetchCandidatesByVoter = async (req, res) => {
    const { voterId, electionId } = req.query;

    if (!voterId || !electionId) {
        return res.status(400).json({ message: "voterId and electionId are required" });
    }

    try {
        const voter = await Voter.findById(voterId);
        if (!voter) return res.status(404).json({ message: "Voter not found!" });

        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: "Election not found!" });

        const halqa = election.electionType === "provincial"
            ? voter.provincialHalqa
            : voter.nationalHalqa;

        const candidates = await Candidate.find({
            election: electionId,
            halqa,
        }).populate("party", "name symbol");

        if (!candidates || candidates.length === 0)
            return res.status(404).json({ message: "No candidates found!" });

        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/vote/submit
export const submitVote = async (req, res) => {
    try {
        const { voterId, candidateId, electionId } = req.body;

        if (!voterId || !candidateId || !electionId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if vote already exists
        const existingVote = await Vote.findOne({ voterId, electionId });
        if (existingVote) {
            return res.status(400).json({ message: "You have already voted in this election." });
        }

        // Validate candidate
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Validate election
        const election = await Election.findById(electionId);
        if (!election || election.status !== "ongoing") {
            return res.status(400).json({ message: "Election is not active." });
        }

        // Save vote to DB
        const newVote = new Vote({
            voterId,
            candidateId,
            electionId,
            halqa: candidate.halqa,
            voteTimestamp: new Date(),
        });

        await newVote.save();

        // Generate hash
        const hash = hashVote({
            voterId,
            candidateId,
            electionId,
            halqa: candidate.halqa,
            voteTimestamp: newVote.voteTimestamp,
        });

        // Store hash on blockchain (ICP)
        await voteActor.storeVoteHash(hash);

        res.status(201).json({ message: "Vote submitted and stored on-chain.", vote: newVote });
    } catch (error) {
        console.error("Submit Vote Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const checkIfVoted = async (req, res) => {
    try {
        const { voterId, electionId } = req.query;

        if (!voterId || !electionId) {
            return res.status(400).json({ message: "VoterId and ElectionId are required." });
        }

        const vote = await Vote.findOne({ voterId, electionId });

        if (vote) {
            return res.status(200).json({ voted: true, candidateId: vote.candidateId });
        } else {
            return res.status(200).json({ voted: false });
        }
    } catch (error) {
        console.error("Check Vote Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
export const verifyElectionVotes = async (req, res) => {
    const { electionId } = req.params;

    if (!electionId) {
        return res.status(400).json({ message: "electionId is required." });
    }

    try {
        const votes = await Vote.find({ electionId });

        if (!votes || votes.length === 0) {
            return res.status(404).json({ message: "No votes found for this election." });
        }

        // Fetch all hashes stored on blockchain
        const onChainHashes = await voteActor.getAllVoteHashes();

        // Loop through and compare
        const results = votes.map((vote) => {
            const localHash = hashVote({
                voterId: vote.voterId.toString(),
                candidateId: vote.candidateId.toString(),
                electionId: vote.electionId.toString(),
                halqa: vote.halqa,
                voteTimestamp: vote.voteTimestamp,
            });

            const verified = onChainHashes.includes(localHash);

            return {
                voteId: vote._id,
                voterId: vote.voterId,
                verified,
                localHash,
            };
        });

        const total = results.length;
        const verifiedCount = results.filter((r) => r.verified).length;

        res.status(200).json({
            electionId,
            totalVotes: total,
            verifiedVotes: verifiedCount,
            mismatchedVotes: total - verifiedCount,
            details: results,
        });
    } catch (error) {
        console.error("Error verifying votes:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
