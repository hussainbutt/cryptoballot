import Array "mo:base/Array";

actor VoteVerification {
  var votes: [Text] = [];

  // Public update method to store vote hash
  public shared(msg) func storeVoteHash(hash: Text) : async Text {
    votes := Array.append(votes, [hash]);
    return "Vote hash stored";
  };

  // Public query method to verify multiple votes
  public shared query func verifyVotes(hashes: [Text]) : async { validCount: Nat; corruptCount: Nat } {
    var validCount: Nat = 0;
    var corruptCount: Nat = 0;

    for (hash in hashes.vals()) {
      if (Array.find<Text>(votes, func(x) { x == hash }) != null) {
        validCount += 1;
      } else {
        corruptCount += 1;
      };
    };

    return {
      validCount = validCount;
      corruptCount = corruptCount;
    };
  };

  // Public query method to get all stored vote hashes
  public shared query func getAllVoteHashes() : async [Text] {
    return votes;
  };
}