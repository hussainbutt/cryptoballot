import cron from "node-cron";
import Election from "../models/election.model.js";
import { getElectionStatus } from "../utils/electionStatus.js";

const updateElectionStatuses = async () => {
    try {
        const elections = await Election.find();
        for (const election of elections) {
            const { status, isActive } = getElectionStatus(election.startTime, election.endTime);
            if (election.status !== status || election.isActive !== isActive) {
                election.status = status;
                election.isActive = isActive;
                await election.save();
                console.log(`Election "${election.title}" status updated to "${status}"`);
            }
        }
    } catch (error) {
        console.error("Failed to update election statuses:", error.message);
    }
};

// Run every minute
cron.schedule("*/30 * * * *", updateElectionStatuses);
