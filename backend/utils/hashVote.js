import crypto from "crypto";

export const hashVote = (vote) => {
    const dataString = JSON.stringify({
        voterId: vote.voterId,
        candidateId: vote.candidateId,
        electionId: vote.electionId,
        halqa: vote.halqa,
        voteTimestamp: vote.voteTimestamp, // use toISOString() if needed
    });

    return crypto.createHash("sha256").update(dataString).digest("hex");
};
