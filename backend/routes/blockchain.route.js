// routes/voteRoutes.js
import express from "express";
import { verifyElectionVotes } from "../controllers/voteController.js";

const router = express.Router();

router.get("/verify/:electionId", verifyElectionVotes);

export default router;
