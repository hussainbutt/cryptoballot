import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 'bcryptjs';// user.model.js
import User from './models/user.model.js';
import Party from './models/party.model.js';
import Election from './models/election.model.js';
import Candidate from './models/candidate.model.js';
import Vote from './models/vote.model.js';
import NadraDB from './models/nadra.model.js';
import dotenv from 'dotenv';
dotenv.config();




async function createDummyData() {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Step 1: Create Parties
    const partyData = [
        {
            name: "Pakistan Tehreek-e-Insaf",
            leader: "Imran Khan",
            symbol: "https://ui-avatars.com/api/?name=PTI&background=0D8ABC&color=fff&size=128",
            status: "active"
        },
        {
            name: "Pakistan Muslim League (N)",
            leader: "Nawaz Sharif",
            symbol: "https://ui-avatars.com/api/?name=PMLN&background=FF5733&color=fff&size=128",
            status: "active"
        },
        {
            name: "Pakistan Peoples Party",
            leader: "Bilawal Bhutto",
            symbol: "https://ui-avatars.com/api/?name=PPP&background=9C27B0&color=fff&size=128",
            status: "active"
        },
        {
            name: "Muttahida Qaumi Movement",
            leader: "Altaf Hussain",
            symbol: "https://ui-avatars.com/api/?name=MQM&background=4CAF50&color=fff&size=128",
            status: "active"
        },
        {
            name: "Jamiat Ulema-e-Islam",
            leader: "Fazl-ur-Rehman",
            symbol: "https://ui-avatars.com/api/?name=JUI&background=FF9800&color=fff&size=128",
            status: "active"
        }
    ];

    const parties = await Party.insertMany(partyData);
    console.log(`${parties.length} parties created`);

    // Step 2: Create Election
    const electionData = {
        title: "General Election 2023",
        electionType: "general",
        startTime: new Date("2023-07-25T08:00:00Z"),
        endTime: new Date("2023-07-25T18:00:00Z"),
        status: "upcoming",
        isActive: true
    };

    const election = await Election.create(electionData);
    console.log('Election created');

    // Step 3: Create Candidates
    const halqas = ["NA-1", "NA-2", "NA-3", "NA-4", "NA-5"];
    const candidateData = [];

    halqas.forEach(halqa => {
        // Party-affiliated candidates
        parties.forEach(party => {
            candidateData.push({
                fullName: `Candidate from ${party.name} in ${halqa}`,
                cnic: generateRandomCNIC(),
                halqa: halqa,
                party: party._id,
                election: election._id,
                symbol: party.symbol
            });
        });

        // Independent candidates (1-2 per halqa)
        const independentCount = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < independentCount; i++) {
            candidateData.push({
                fullName: `Independent Candidate ${i + 1} in ${halqa}`,
                cnic: generateRandomCNIC(),
                halqa: halqa,
                party: null,
                election: election._id,
                symbol: `https://example.com/independent${Math.floor(Math.random() * 10)}.png`
            });
        }
    });

    const candidates = await Candidate.insertMany(candidateData);
    console.log(`${candidates.length} candidates created`);

    // Step 4 & 5: Create Voters and NADRA Records
    const totalVoters = 1000;
    const halqaDistribution = [0.2, 0.25, 0.15, 0.3, 0.1];
    const voterData = [];
    const nadraData = [];

    for (let i = 0; i < totalVoters; i++) {
        const halqaIndex = getRandomIndexByDistribution(halqaDistribution);
        const halqa = halqas[halqaIndex];
        const cnic = generateRandomCNIC();
        const phone = `03${Math.floor(100000000 + Math.random() * 900000000)}`;
        const name = `Voter ${i + 1}`;

        voterData.push({
            cnic: cnic,
            phone: phone,
            password: bcrypt.hashSync("password123", 10),
            provincialHalqa: `PP-${Math.floor(Math.random() * 10) + 1}`,
            nationalHalqa: halqa,
            name: name,
            role: "voter"
        });

        nadraData.push({
            fullName: name,
            cnic: cnic,
            phone: phone,
            fatherName: `Father of ${name}`,
            dob: new Date(1980 + Math.floor(Math.random() * 20)),
            gender: Math.random() > 0.5 ? "Male" : "Female",
            address: `House ${Math.floor(Math.random() * 100)}, Street ${Math.floor(Math.random() * 50)}, ${halqa}`,
            halqa: halqa
        });
    }

    // First create NADRA records
    await NadraDB.insertMany(nadraData);
    console.log(`${nadraData.length} NADRA records created`);

    // Then create voters
    const voters = await User.insertMany(voterData);
    console.log(`${voters.length} voters created`);

    // Step 6: Simulate Voting
    const voteData = [];
    const candidatesByHalqa = {};

    // Group candidates by halqa for easier lookup
    candidates.forEach(candidate => {
        if (!candidatesByHalqa[candidate.halqa]) {
            candidatesByHalqa[candidate.halqa] = [];
        }
        candidatesByHalqa[candidate.halqa].push(candidate);
    });

    voters.forEach(voter => {
        const halqaCandidates = candidatesByHalqa[voter.nationalHalqa];

        // 70% turnout
        if (Math.random() > 0.3) {
            const votedCandidate = halqaCandidates[Math.floor(Math.random() * halqaCandidates.length)];

            voteData.push({
                voterId: voter._id,
                candidateId: votedCandidate._id,
                electionId: election._id,
                halqa: voter.nationalHalqa,
                voteTimestamp: new Date(
                    election.startTime.getTime() +
                    Math.random() * (election.endTime.getTime() - election.startTime.getTime())
                )
            });
        }
    });

    const votes = await Vote.insertMany(voteData);
    console.log(`${votes.length} votes cast`);

    // Update election status to ongoing (for testing)
    election.status = "ongoing";
    await election.save();
    console.log('Election status updated to ongoing');

    console.log('Dummy data creation complete!');
    process.exit(0);
}

// Helper functions
function generateRandomCNIC() {
    return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
}

function getRandomIndexByDistribution(distribution) {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < distribution.length; i++) {
        sum += distribution[i];
        if (rand <= sum) return i;
    }
    return distribution.length - 1;
}

createDummyData().catch(err => {
    console.error('Error creating dummy data:', err);
    process.exit(1);
});