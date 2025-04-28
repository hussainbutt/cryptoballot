import express from "express";
import { fetchCandidatesByVoter, submitVote, checkIfVoted } from "../controllers/vote.controller.js";

const router = express.Router();

router.get("/candidates", fetchCandidatesByVoter); // ?voterId=...&electionId=...
router.post("/submit", submitVote); // ?voterId=...&electionId=...

router.get("/check", checkIfVoted);

export default router;
