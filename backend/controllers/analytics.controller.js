import Election from "../models/election.model.js";
import Vote from "../models/vote.model.js";
import Candidate from "../models/candidate.model.js";
import Party from "../models/party.model.js";

// Get overall election results
export const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Get all votes for this election with complete party information
        const votes = await Vote.find({ electionId }).populate({
            path: 'candidateId',
            populate: {
                path: 'party',
                model: 'Party',
                select: 'name symbol' // Include party symbol
            }
        });

        if (!votes || votes.length === 0) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        // Calculate party-wise results focusing on halqas won
        const partyResults = {};
        const halqaResults = {};

        // First pass: Determine winning party in each halqa
        votes.forEach(vote => {
            const candidate = vote.candidateId;
            const partyId = candidate.party ? candidate.party._id.toString() : 'independent';
            const partyName = candidate.party ? candidate.party.name : 'Independent';
            const partySymbol = candidate.party ? candidate.party.symbol : null;
            const halqa = vote.halqa;

            // Halqa-wise counting
            if (!halqaResults[halqa]) {
                halqaResults[halqa] = {
                    totalVotes: 0,
                    candidates: {}
                };
            }
            halqaResults[halqa].totalVotes += 1;

            if (!halqaResults[halqa].candidates[partyId]) {
                halqaResults[halqa].candidates[partyId] = {
                    partyName,
                    partySymbol,
                    votes: 0,
                    candidateName: candidate.fullName
                };
            }
            halqaResults[halqa].candidates[partyId].votes += 1;
        });

        // Determine winning party in each halqa and count halqas won per party
        const halqaWinners = {};
        Object.keys(halqaResults).forEach(halqa => {
            const candidates = halqaResults[halqa].candidates;
            let maxVotes = 0;
            let winningParty = null;

            Object.keys(candidates).forEach(partyId => {
                if (candidates[partyId].votes > maxVotes) {
                    maxVotes = candidates[partyId].votes;
                    winningParty = {
                        partyId,
                        partyName: candidates[partyId].partyName,
                        partySymbol: candidates[partyId].partySymbol,
                        candidateName: candidates[partyId].candidateName
                    };
                }
            });

            halqaWinners[halqa] = winningParty;

            // Count halqas won per party
            if (winningParty) {
                const partyId = winningParty.partyId;
                if (!partyResults[partyId]) {
                    partyResults[partyId] = {
                        partyName: winningParty.partyName,
                        partySymbol: winningParty.partySymbol,
                        halqasWon: new Set(),
                        totalHalqas: 0
                    };
                }
                partyResults[partyId].halqasWon.add(halqa);
            }
        });

        // Calculate total halqas in the election
        const totalHalqas = Object.keys(halqaResults).length;

        // Prepare final party results sorted by halqas won
        const formattedPartyResults = Object.keys(partyResults)
            .map(partyId => {
                const partyData = partyResults[partyId];
                const halqasWonCount = partyData.halqasWon.size;
                return {
                    partyId: partyId === 'independent' ? null : partyId,
                    partyName: partyData.partyName,
                    partySymbol: partyData.partySymbol,
                    halqasWon: Array.from(partyData.halqasWon),
                    halqasWonCount,
                    halqaPercentage: ((halqasWonCount / totalHalqas) * 100).toFixed(2)
                };
            })
            .sort((a, b) => b.halqasWonCount - a.halqasWonCount);

        // Determine overall winner based on halqas won
        const electionWinner = formattedPartyResults.length > 0
            ? formattedPartyResults[0]
            : null;

        res.status(200).json({
            totalHalqas,
            parties: formattedPartyResults,
            halqaWinners,
            electionWinner
        });

    } catch (error) {
        console.error("Error in getElectionResults:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get leading party information
export const getLeadingParty = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Get all votes with party symbol information
        const votes = await Vote.find({ electionId }).populate({
            path: 'candidateId',
            populate: {
                path: 'party',
                model: 'Party',
                select: 'name symbol'
            }
        });

        if (!votes || votes.length === 0) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        // Calculate halqas won by each party
        const halqaResults = {};
        const partyHalqas = {};

        // First determine winners in each halqa
        votes.forEach(vote => {
            const candidate = vote.candidateId;
            const partyId = candidate.party ? candidate.party._id.toString() : 'independent';
            const partyName = candidate.party ? candidate.party.name : 'Independent';
            const partySymbol = candidate.party ? candidate.party.symbol : null;
            const halqa = vote.halqa;

            if (!halqaResults[halqa]) {
                halqaResults[halqa] = {
                    candidates: {}
                };
            }

            if (!halqaResults[halqa].candidates[partyId]) {
                halqaResults[halqa].candidates[partyId] = {
                    partyName,
                    partySymbol,
                    votes: 0
                };
            }

            halqaResults[halqa].candidates[partyId].votes += 1;
        });

        // Count halqas won by each party
        Object.keys(halqaResults).forEach(halqa => {
            const candidates = halqaResults[halqa].candidates;
            let maxVotes = 0;
            let winningPartyId = null;

            Object.keys(candidates).forEach(partyId => {
                if (candidates[partyId].votes > maxVotes) {
                    maxVotes = candidates[partyId].votes;
                    winningPartyId = partyId;
                }
            });

            if (winningPartyId) {
                if (!partyHalqas[winningPartyId]) {
                    partyHalqas[winningPartyId] = {
                        partyName: halqaResults[halqa].candidates[winningPartyId].partyName,
                        partySymbol: halqaResults[halqa].candidates[winningPartyId].partySymbol,
                        halqasWon: 0
                    };
                }
                partyHalqas[winningPartyId].halqasWon += 1;
            }
        });

        // Find leading party
        let leadingParty = null;
        let maxHalqas = 0;
        const totalHalqas = Object.keys(halqaResults).length;

        Object.keys(partyHalqas).forEach(partyId => {
            if (partyHalqas[partyId].halqasWon > maxHalqas) {
                maxHalqas = partyHalqas[partyId].halqasWon;
                leadingParty = {
                    partyId: partyId === 'independent' ? null : partyId,
                    partyName: partyHalqas[partyId].partyName,
                    partySymbol: partyHalqas[partyId].partySymbol,
                    halqasWon: maxHalqas,
                    halqaPercentage: ((maxHalqas / totalHalqas) * 100).toFixed(2)
                };
            }
        });

        if (!leadingParty) {
            return res.status(404).json({ message: "Could not determine leading party" });
        }

        res.status(200).json(leadingParty);

    } catch (error) {
        console.error("Error in getLeadingParty:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get halqa-wise results with party symbols
export const getHalqaWiseResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Get all votes with party symbols
        const votes = await Vote.find({ electionId }).populate({
            path: 'candidateId',
            populate: {
                path: 'party',
                model: 'Party',
                select: 'name symbol'
            }
        });

        if (!votes || votes.length === 0) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        // Group votes by halqa
        const halqaResults = {};

        votes.forEach(vote => {
            const candidate = vote.candidateId;
            const partyId = candidate.party ? candidate.party._id.toString() : 'independent';
            const partyName = candidate.party ? candidate.party.name : 'Independent';
            const partySymbol = candidate.party ? candidate.party.symbol : null;
            const halqa = vote.halqa;

            if (!halqaResults[halqa]) {
                halqaResults[halqa] = {
                    totalVotes: 0,
                    candidates: {}
                };
            }

            halqaResults[halqa].totalVotes += 1;

            if (!halqaResults[halqa].candidates[partyId]) {
                halqaResults[halqa].candidates[partyId] = {
                    partyName,
                    partySymbol,
                    votes: 0,
                    candidateName: candidate.fullName
                };
            }

            halqaResults[halqa].candidates[partyId].votes += 1;
        });

        // Format the results
        const formattedResults = Object.keys(halqaResults).map(halqa => {
            const halqaData = halqaResults[halqa];
            const candidates = Object.keys(halqaData.candidates).map(partyId => {
                return {
                    partyId: partyId === 'independent' ? null : partyId,
                    partyName: halqaData.candidates[partyId].partyName,
                    partySymbol: halqaData.candidates[partyId].partySymbol,
                    candidateName: halqaData.candidates[partyId].candidateName,
                    votes: halqaData.candidates[partyId].votes,
                    votePercentage: ((halqaData.candidates[partyId].votes / halqaData.totalVotes) * 100).toFixed(2)
                };
            });

            // Sort candidates by votes (descending)
            candidates.sort((a, b) => b.votes - a.votes);

            return {
                halqa,
                totalVotes: halqaData.totalVotes,
                candidates
            };
        });

        res.status(200).json(formattedResults);

    } catch (error) {
        console.error("Error in getHalqaWiseResults:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};