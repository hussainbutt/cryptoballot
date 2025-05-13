import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as voteIDL } from "./vote_verification.js"; // Adjust if needed
import { canisterId as voteCanisterId } from "./index.js";       // Adjust if needed

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

// Optional: Only in development, fetch root key for local network
if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Is the local replica running?");
    });
}

const voteCanister = Actor.createActor(voteIDL, {
    agent,
    canisterId: voteCanisterId,
});

export default voteCanister;
