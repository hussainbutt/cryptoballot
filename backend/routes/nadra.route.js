import express from 'express';
import { getAllRecords, getRecordByCNIC, createNadraRecord } from '../controllers/nadra.controller.js';

const router = express.Router();

// Route to get all NADRA records
router.get('/nadra', getAllRecords);

// Route to get a NADRA record by CNIC
router.get('/:cnic', getRecordByCNIC);
router.post("/create", createNadraRecord);

export default router;
