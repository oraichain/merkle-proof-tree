const {
  MerkleProofTree,
  sha256,
  verifyHexProof
} = require('./merkle-proof-tree');

const data = require('../testdata/airdrop_stage_2_list.json');

const tree = new MerkleProofTree(data.map(JSON.stringify));

const proofItem = {
  ...data[0],
  root: tree.getHexRoot()
};
const hexLeaf = sha256(JSON.stringify(data[0])).toString('hex');
proofItem.proofs = tree.getHexProof(hexLeaf);

console.log('proofItem', proofItem, tree.getHexLeaves(), hexLeaf);

const verified = verifyHexProof(hexLeaf, proofItem.proofs, proofItem.root);
console.log('verified', verified);
