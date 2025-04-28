import express from "express";
import {
    getElectionResults,
    getLeadingParty,
    getHalqaWiseResults
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Get overall election results
router.get("/results/:electionId", getElectionResults);

// Get leading party information
router.get("/leading-party/:electionId", getLeadingParty);

// Get halqa-wise results
router.get("/halqa-results/:electionId", getHalqaWiseResults);

export default router;