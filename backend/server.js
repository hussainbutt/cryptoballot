import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
// import candidateRoutes from "./routes/candidate.route.js";
import partyRoutes from './routes/party.route.js';
import nadraRoutes from './routes/nadra.route.js';
import electionRoutes from './routes/election.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB ERROR', err));






// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nadra', nadraRoutes);
// app.use("/api/candidates", candidateRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/elections', electionRoutes);


// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
