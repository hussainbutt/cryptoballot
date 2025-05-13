// routes/voteRoutes.js
import express from "express";
import { verifyVotes } from '../controllers/blockchain.controller.js';

const router = express.Router();

router.post('/verify/:electionId', verifyVotes);

export default router;
