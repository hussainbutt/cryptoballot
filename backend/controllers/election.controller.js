// controllers/election.controller.js
import Election from "../models/election.model.js";

// Get all elections
export const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single election by ID
export const getElectionById = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        res.status(200).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new election
export const createElection = async (req, res) => {
    const { title, startTime, endTime, electionType, status } = req.body;

    try {
        const election = new Election({
            title,
            startTime,
            endTime,
            electionType,
            status,
        });

        await election.save();
        res.status(201).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an election
export const updateElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        res.status(200).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an election
export const deleteElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndDelete(req.params.id);

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        res.status(200).json({ message: "Election deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
