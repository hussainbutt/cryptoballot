import express from 'express';
import { getAllRecords, getRecordByCNIC } from '../controllers/nadra.controller.js';

const router = express.Router();

// Route to get all NADRA records
router.get('/nadra', getAllRecords);

// Route to get a NADRA record by CNIC
router.get('/nadra/:cnic', getRecordByCNIC);

export default router;
