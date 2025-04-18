// backend/routes/candidateRoutes.js
import express from "express";
import {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
} from "../controllers/candidate.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.post("/", upload.single("symbol"), createCandidate);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);

export default router;
