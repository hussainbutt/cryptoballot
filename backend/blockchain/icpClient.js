// backend/utils/icpClient.js
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as voteIDL } from "../../../.dfx/local/canisters/vote_verification"; // adjust path if needed
import { canisterId as voteCanisterId } from "../../../.dfx/local/canisters/vote_verification";

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
await agent.fetchRootKey(); // Only in local

export const voteActor = Actor.createActor(voteIDL, {
    agent,
    canisterId: voteCanisterId,
});
