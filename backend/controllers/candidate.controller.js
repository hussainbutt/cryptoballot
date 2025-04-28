// backend/controllers/candidate.controller.js
import Candidate from "../models/candidate.model.js";
import cloudinary from "cloudinary";
import { validationResult } from "express-validator";
import stream from "stream";


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createCandidate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Destructure the fields from the request body
        const { fullName, cnic, electionId, partyId, halqa } = req.body;
        let symbol = "";

        // Check if the candidate is independent and upload the symbol to Cloudinary
        if (!partyId && req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "candidate_symbols" },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ message: "Error uploading symbol to Cloudinary." });
                    }
                    symbol = result.secure_url; // Get the Cloudinary URL of the uploaded image
                }
            );

            // Pass the file buffer from multer
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            bufferStream.pipe(result);
        }

        // Create the candidate record
        const candidate = new Candidate({
            fullName,
            cnic,
            election: electionId,
            party: partyId || null, // Null if independent
            symbol: symbol || null, // Symbol URL if independent
            halqa,
        });

        // Save the candidate to the database
        await candidate.save();
        return res.status(201).json(candidate);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating candidate." });
    }
};

export const updateCandidate = async (req, res) => {
    const { fullName, cnic, electionId, partyId, halqa } = req.body;
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) return res.status(404).json({ message: "Candidate not found." });

        candidate.fullName = fullName || candidate.fullName;
        candidate.cnic = cnic || candidate.cnic;
        candidate.election = electionId || candidate.election;
        candidate.party = partyId || candidate.party;
        candidate.halqa = halqa || candidate.halqa;

        if (req.file) {
            // If an independent candidate, upload the new symbol to Cloudinary
            const result = await cloudinary.uploader.upload_stream(
                { folder: "candidate_symbols" },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ message: "Error uploading symbol to Cloudinary." });
                    }
                    candidate.symbol = result.secure_url; // Update the symbol URL
                }
            );

            // Pass the file buffer from multer
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            bufferStream.pipe(result);
        }

        await candidate.save();
        return res.json(candidate);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating candidate." });
    }
};

const getHalqaPrefix = (type, province) => {
    if (type === "general") return "NA-";
    if (province === "Punjab") return "PP-";
    if (province === "Sindh") return "PS-";
    if (province === "KPK") return "PK-";
    if (province === "Balochistan") return "PB-";
    return "";
};

// Get all candidates
export const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate("party election");
        res.status(200).json(candidates);
    } catch (err) {
        res.status(500).json({ message: "Error getting candidates" });
    }
};

// Get single candidate
export const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate("party election");
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });
        res.status(200).json(candidate);
    } catch (err) {
        res.status(500).json({ message: "Error fetching candidate" });
    }
};



// Delete candidate
export const deleteCandidate = async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Candidate deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting candidate" });
    }
};

//Fetch candidates for vote screen
export const fetchCandidatesAccordingToHalqa = async (req, res) => {
    const { electionId, voterId } = req.query;

    if (!electionId || !voterId) {
        return res.status(400).json({ message: "Missing electionId or voterId" });
    }

    try {
        // Find voter to get their halqa
        const voter = await Voter.findById(voterId);
        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }

        const voterHalqa = voter.halqa;

        // Fetch candidates that match the election and halqa
        const candidates = await Candidate.find({
            electionId,
            halqa: voterHalqa,
        }).populate("partyId", "partyName partySymbol"); // optional

        res.status(200).json(candidates);
    } catch (err) {
        console.error("Error in fetchCandidatesAccordingToHalqa:", err);
        res.status(500).json({ message: "Server error" });
    }
};