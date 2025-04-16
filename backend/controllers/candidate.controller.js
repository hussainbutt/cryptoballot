// import Candidate from "../models/candidate.model.js";
// import Party from "../models/party.model.js"; // Assuming you have a Party model
// import { validateCNIC } from "../utils/validateCnic.js";


// // Create a new candidate
// export const createCandidate = async (req, res) => {
//     try {
//         const { name, cnic, party, naHalqa, ppHalqa } = req.body;
//         const symbol = req.file; // This is the uploaded file from the form

//         // Log to check the received data
//         console.log("Received Candidate Data:", req.body);
//         console.log("Received Symbol File:", symbol);

//         // Validate CNIC
//         if (!validateCNIC(cnic)) {
//             return res.status(400).json({ message: "Invalid CNIC format." });
//         }

//         // Handle saving candidate
//         const candidate = new Candidate({
//             fullName: name,
//             cnic,
//             party: party === "independent" ? null : party, // Handle "independent" party separately
//             halqa: { naHalqa, ppHalqa },
//             symbol: symbol ? symbol.path : null, // Save file path if symbol is uploaded
//         });

//         await candidate.save();
//         return res.status(201).json({ message: "Candidate created successfully", candidate });
//     } catch (err) {
//         console.error("Error creating candidate:", err);
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

// // Get all candidates
// export const getAllCandidates = async (req, res) => {
//     try {
//         const candidates = await Candidate.find().populate("party");
//         return res.status(200).json(candidates);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Get a specific candidate by ID
// export const getCandidateById = async (req, res) => {
//     try {
//         const candidate = await Candidate.findById(req.params.id).populate("party");
//         if (!candidate) {
//             return res.status(404).json({ message: "Candidate not found." });
//         }
//         return res.status(200).json(candidate);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Update a candidate
// export const updateCandidate = async (req, res) => {
//     try {
//         const { name, cnic, party, naHalqa, ppHalqa, symbol } = req.body;

//         // Validate CNIC
//         if (!validateCNIC(cnic)) {
//             return res.status(400).json({ message: "Invalid CNIC format." });
//         }

//         // Get candidate and update
//         let candidate = await Candidate.findById(req.params.id);
//         if (!candidate) {
//             return res.status(404).json({ message: "Candidate not found." });
//         }

//         // Get party data if linked to a party
//         let partyData = null;
//         if (party) {
//             partyData = await Party.findById(party);
//             if (!partyData) {
//                 return res.status(400).json({ message: "Party not found." });
//             }
//         }

//         candidate.name = name || candidate.name;
//         candidate.cnic = cnic || candidate.cnic;
//         candidate.party = partyData ? partyData._id : null;
//         candidate.naHalqa = naHalqa || candidate.naHalqa;
//         candidate.ppHalqa = ppHalqa || candidate.ppHalqa;
//         candidate.symbol = symbol || candidate.symbol;

//         await candidate.save();

//         return res.status(200).json({
//             message: "Candidate updated successfully.",
//             candidate,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Delete a candidate
// export const deleteCandidate = async (req, res) => {
//     try {
//         const candidate = await Candidate.findByIdAndDelete(req.params.id);
//         if (!candidate) {
//             return res.status(404).json({ message: "Candidate not found." });
//         }

//         return res.status(200).json({ message: "Candidate deleted successfully." });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };
