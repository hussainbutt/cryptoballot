import express from "express";
import {
    createElection,
    getAllElections,
    getElectionById,
    deleteElection,
    getElectionByFilter
} from "../controllers/election.controller.js";

const router = express.Router();

router.get("/", getAllElections);
router.get("/filter", getElectionByFilter);
router.get("/:id", getElectionById);
// Route: /elections/filter?status=ended&halqa=NA-123


router.post("/", createElection);
router.delete("/:id", deleteElection);

export default router;
