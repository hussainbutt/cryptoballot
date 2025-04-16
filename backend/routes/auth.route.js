import express from 'express';
import { registerUser, loginUser, updateUser, deleteAccount } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/update/:cnic', updateUser);
router.delete('/delete/:cnic', deleteAccount);


export default router;
