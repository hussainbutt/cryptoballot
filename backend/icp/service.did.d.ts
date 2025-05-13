import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface _SERVICE {
  storeVoteHash: ActorMethod<[string], string>;
  verifyVotes: ActorMethod<
    [Array<string>],
    { corruptCount: bigint; validCount: bigint }
  >;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
