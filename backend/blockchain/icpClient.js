// backend/blockchain/icpClient.js
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as voteIDL } from "./../icp/index.js"

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
await agent.fetchRootKey(); // Only in local

// Use the new canister ID from the deployment
const voteCanisterId = "uxrrr-q7777-77774-qaaaq-cai";

export const voteActor = Actor.createActor(voteIDL, {
    agent,
    canisterId: voteCanisterId,
});
