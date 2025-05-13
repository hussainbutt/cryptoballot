
import express from "express";
import { fetchCandidatesByVoter, submitVote, checkIfVoted, verifyElectionVotes } from "../controllers/vote.controller.js";

const router = express.Router();

router.get("/candidates", fetchCandidatesByVoter); // ?voterId=...&electionId=...
router.post("/submit", submitVote); // ?voterId=...&electionId=...

router.get("/check", checkIfVoted);

router.get("/verify/:electionId", verifyElectionVotes);


export default router;
