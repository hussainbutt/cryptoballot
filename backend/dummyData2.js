// dummyProvincialData.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import Party from './models/party.model.js';
import Election from './models/election.model.js';
import Candidate from './models/candidate.model.js';
import Vote from './models/vote.model.js';
import NadraDB from './models/nadra.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function createProvincialDummyData() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Step 1: Create Election
    const electionData = {
        title: "Punjab Assembly Election 2023",
        electionType: "provincial",
        startTime: new Date("2023-08-01T08:00:00Z"),
        endTime: new Date("2023-08-01T18:00:00Z"),
        status: "upcoming",
        isActive: true
    };

    const election = await Election.create(electionData);
    console.log('Provincial Election created');

    // Step 2: Fetch Parties
    const parties = await Party.find({});
    if (parties.length === 0) {
        throw new Error('No parties found. Please insert parties first.');
    }

    // Step 3: Define Provinces and Halqas
    const provinces = {
        Punjab: "PP",
        Sindh: "PS",
        KPK: "PK",
        Balochistan: "PB"
    };

    const halqas = [];
    for (const [province, prefix] of Object.entries(provinces)) {
        for (let i = 1; i <= 7; i++) {
            halqas.push({
                province,
                halqa: `${prefix}-${i}`
            });
        }
    }

    // Step 4: Create Candidates
    const candidateData = [];

    halqas.forEach(({ province, halqa }) => {
        // Party-affiliated candidates
        parties.forEach(party => {
            candidateData.push({
                fullName: `${party.name} Candidate for ${halqa}`,
                cnic: generateRandomCNIC(),
                halqa: halqa,
                province: province,
                party: party._id,
                election: election._id,
                symbol: party.symbol
            });
        });

        // Independent candidates
        const independentCount = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < independentCount; i++) {
            candidateData.push({
                fullName: `Independent Candidate ${i + 1} for ${halqa}`,
                cnic: generateRandomCNIC(),
                halqa: halqa,
                province: province,
                party: null,
                election: election._id,
                symbol: `https://example.com/independent${Math.floor(Math.random() * 10)}.png`
            });
        }
    });

    const candidates = await Candidate.insertMany(candidateData);
    console.log(`${candidates.length} candidates created`);

    // Step 5: Create Voters and NADRA Records
    const totalVoters = 1500;
    const voterData = [];
    const nadraData = [];

    for (let i = 0; i < totalVoters; i++) {
        const { halqa, province } = halqas[Math.floor(Math.random() * halqas.length)];
        const cnic = generateRandomCNIC();
        const phone = `03${Math.floor(100000000 + Math.random() * 900000000)}`;
        const name = `Voter ${i + 1}`;

        voterData.push({
            cnic: cnic,
            phone: phone,
            password: bcrypt.hashSync("password123", 10),
            provincialHalqa: halqa,
            nationalHalqa: `NA-${Math.floor(Math.random() * 100) + 1}`, // Random NA constituency
            name: name,
            role: "voter"
        });

        nadraData.push({
            fullName: name,
            cnic: cnic,
            phone: phone,
            fatherName: `Father of ${name}`,
            dob: new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            gender: Math.random() > 0.5 ? "Male" : "Female",
            address: `House ${Math.floor(Math.random() * 100)}, Street ${Math.floor(Math.random() * 50)}, ${province}`,
            halqa: halqa
        });
    }

    await NadraDB.insertMany(nadraData);
    console.log(`${nadraData.length} NADRA records created`);

    const voters = await User.insertMany(voterData);
    console.log(`${voters.length} voters created`);

    // Step 6: Simulate Voting
    const voteData = [];
    const candidatesByHalqa = {};

    candidates.forEach(candidate => {
        if (!candidatesByHalqa[candidate.halqa]) {
            candidatesByHalqa[candidate.halqa] = [];
        }
        candidatesByHalqa[candidate.halqa].push(candidate);
    });

    voters.forEach(voter => {
        const halqaCandidates = candidatesByHalqa[voter.provincialHalqa];

        // 75% turnout
        if (halqaCandidates && Math.random() > 0.25) {
            const votedCandidate = halqaCandidates[Math.floor(Math.random() * halqaCandidates.length)];

            voteData.push({
                voterId: voter._id,
                candidateId: votedCandidate._id,
                electionId: election._id,
                halqa: voter.provincialHalqa,
                voteTimestamp: new Date(
                    election.startTime.getTime() +
                    Math.random() * (election.endTime.getTime() - election.startTime.getTime())
                )
            });
        }
    });

    const votes = await Vote.insertMany(voteData);
    console.log(`${votes.length} votes cast`);

    // Update election status to ongoing
    election.status = "ongoing";
    await election.save();
    console.log('Election status updated to ongoing');

    console.log('Provincial dummy data creation complete!');
    process.exit(0);
}

// Helper functions
function generateRandomCNIC() {
    return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
}

createProvincialDummyData().catch(err => {
    console.error('Error creating provincial dummy data:', err);
    process.exit(1);
});
