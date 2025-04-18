import Election from "../models/election.model.js";
import { getElectionStatus } from "../utils/electionStatus.js";

export const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find();
        const updated = await Promise.all(
            elections.map(async (election) => {
                const { status, isActive } = getElectionStatus(election.startTime, election.endTime);
                if (election.status !== status || election.isActive !== isActive) {
                    election.status = status;
                    election.isActive = isActive;
                    await election.save();
                }
                return election;
            })
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getElectionById = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) return res.status(404).json({ message: "Election not found" });

        const { status, isActive } = getElectionStatus(election.startTime, election.endTime);
        if (election.status !== status || election.isActive !== isActive) {
            election.status = status;
            election.isActive = isActive;
            await election.save();
        }

        res.json(election);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createElection = async (req, res) => {
    try {
        const { title, startTime, endTime, electionType } = req.body;
        const { status, isActive } = getElectionStatus(startTime, endTime);

        const newElection = new Election({
            title,
            startTime,
            endTime,
            electionType,
            status,
            isActive,
        });

        await newElection.save();
        res.status(201).json(newElection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndDelete(req.params.id);
        if (!election) return res.status(404).json({ message: "Election not found" });

        res.status(200).json({ message: "Election deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getElectionByFilter = async (req, res) => {
    const { status, halqa } = req.query;

    try {
        const filter = {};

        if (status) filter.status = status;
        if (halqa) filter.halqa = halqa;

        const elections = await Election.find(filter);
        res.status(200).json(elections);
    } catch (error) {
        console.error("Error filtering elections:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
