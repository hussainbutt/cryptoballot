// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const CandidateSchema = new Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     cnic: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     halqa: {
//         type: String,
//         required: true,
//     },
//     party: {
//         type: Schema.Types.ObjectId,
//         ref: 'Party', // Linking the candidate to the Party model
//         required: true,
//     },
//     election: {
//         type: Schema.Types.ObjectId,
//         ref: 'Election', // Linking the candidate to an Election
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active', // Candidate's current status in the election
//     },
// });

// const Candidate = mongoose.model('Candidate', CandidateSchema);

// export default Candidate;
