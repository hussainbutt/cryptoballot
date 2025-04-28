import Voter from "../models/user.model.js";
import Election from "../models/election.model.js"
import Candidate from "../models/candidate.model.js";
import Vote from "../models/vote.model.js"

// GET /api/vote/candidates?voterId=...&electionId=...
export const fetchCandidatesByVoter = async (req, res) => {
    const { voterId, electionId } = req.query;
    if (!voterId || !electionId) {
        return res.status(400).json({ message: "voterId and electionId are required" });
    }

    try {
        const voter = await Voter.findById(voterId);
        if (!voter) return res.status(404).json({ message: "Voter not found!" });
        console.log(voter);

        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: "Election not found!" })
        let halqa = null;
        if (election.electionType === "provincial")
            halqa = voter.provincialHalqa;
        else
            halqa = voter.nationalHalqa;
        console.log('====================================');
        console.log("halqais: " + halqa);
        console.log('====================================');

        const candidates = await Candidate.find({
            election: electionId,
            halqa,
        }).populate("party", "name symbol");
        if (!candidates) return res.status(404).json({ message: "candidate not found!" })

        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//submitVote
// controllers/voteController.js

export const submitVote = async (req, res) => {
    try {
        const { voterId, candidateId, electionId } = req.body;

        if (!voterId || !candidateId || !electionId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if voter has already voted in this election
        const existingVote = await Vote.findOne({ voterId, electionId });

        if (existingVote) {
            return res.status(400).json({ message: "You have already voted in this election." });
        }

        // Check if candidate exists and is valid for this election
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Optionally: Check if election exists and is active
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found." });
        }
        if (election.status !== "ongoing") {
            return res.status(400).json({ message: "Election is not active." });
        }

        // Save vote
        const newVote = new Vote({
            voterId,
            candidateId,
            electionId,
            halqa: candidate.halqa, // Assuming candidate model has halqa
            voteTimestamp: new Date(),
        });

        await newVote.save();

        res.status(201).json({ message: "Vote submitted successfully.", vote: newVote });
    } catch (error) {
        console.error("Submit Vote Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const checkIfVoted = async (req, res) => {
    try {
        console.log("reached checkIfVoted");

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