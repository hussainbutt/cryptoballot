import express from "express";
import upload from "../middleware/multer.js";
import {
    createParty,
    getAllParties,
    deleteParty,
    updateParty,
} from "../controllers/party.controller.js";

const router = express.Router();

router.post("/", upload.single("symbol"), createParty);
router.get("/", getAllParties);
router.put("/:id", updateParty);
router.delete("/:id", deleteParty);

export default router;
