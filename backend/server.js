import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
// import candidateRoutes from "./routes/candidate.route.js";
import partyRoutes from './routes/party.route.js';
import voteRoutes from "./routes/vote.route.js";
import nadraRoutes from './routes/nadra.route.js';
import electionRoutes from './routes/election.route.js';
import candidateRoutes from './routes/candidate.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import blockchainRoutes from './routes/blockchain.route.js'
import "./cron/updateElectionStatus.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB ERROR', err));






// Routes
app.use("/api/votes", voteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nadra', nadraRoutes);
app.use("/api/candidates", candidateRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/blockchain', blockchainRoutes);


// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
