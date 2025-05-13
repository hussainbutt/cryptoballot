// backend/blockchain/icpClient.js
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as voteIDL } from "./../icp/index.js"
import { canisterId as voteCanisterId } from "./../icp/index.js"

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
await agent.fetchRootKey(); // Only in local

export const voteActor = Actor.createActor(voteIDL, {
    agent,
    canisterId: voteCanisterId,
});
