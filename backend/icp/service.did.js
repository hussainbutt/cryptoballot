export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'storeVoteHash': IDL.Func([IDL.Text], [IDL.Text], []),
    'verifyVotes': IDL.Func(
      [IDL.Vec(IDL.Text)],
      [IDL.Record({ 'corruptCount': IDL.Nat, 'validCount': IDL.Nat })],
      [],
    ),
  });
};
export const init = ({ IDL }) => { return []; };
