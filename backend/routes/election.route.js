// routes/election.routes.js
import express from "express";
import {
    getAllElections,
    getElectionById,
    createElection,
    updateElection,
    deleteElection,
} from "../controllers/election.controller.js";

const router = express.Router();

// Get all elections
router.get("/", getAllElections);

// Get election by ID
router.get("/:id", getElectionById);

// Create a new election
router.post("/", createElection);

// Update election by ID
router.put("/:id", updateElection);

// Delete election by ID
router.delete("/:id", deleteElection);

export default router;
