const { MerkleTree } = require('merkletreejs');
const crypto = require('crypto');

const data = [
  { address: 'wasm1uy9ucvgerneekxpnfwyfnpxvlsx5dzdpf0mzjd', amount: '1010' },
  { address: 'wasm1a4x6au55s0fusctyj2ulrxvfpmjcxa92k7ze2v', amount: '999' },
  {
    address: 'wasm1ylna88nach9sn5n7qe7u5l6lh7dmt6lp2y63xx',
    amount: '1000000000'
  },
  { address: 'wasm1qzy8rg0f406uvvl54dlww6ptlh30303xq2u3xu', amount: '10220' },
  { address: 'wasm1c99d6aw39e027fmy5f2gj38g8p8c3cf0vn3qqn', amount: '1322' },
  { address: 'wasm1uwcjkghqlz030r989clzqs8zlaujwyphx0yumy', amount: '14' },
  { address: 'wasm1yggt0x0r3x5ujk96kfeps6v4yakgun8mdth90j', amount: '9000000' },
  { address: 'wasm1f6s77fjplerjrh4yjj08msqdq36mam4xv9tjvs', amount: '12333' },
  { address: 'wasm1xn46zz5m3fhymcrcwe82m0ac8ytt588dkpaeas', amount: '1322' }
];

const sha256 = (data) => crypto.createHash('sha256').update(data).digest();
const verifyHexProof = (hexLeaf, hexProof, hexRoot) => {
  const leaf = Buffer.from(hexLeaf, 'hex');
  const proof = hexProof.map((hex) => Buffer.from(hex, 'hex'));
  const hashBuf = proof.reduce(
    (hashBuf, proofBuf) =>
      sha256(Buffer.concat([hashBuf, proofBuf].sort(Buffer.compare))),
    leaf
  );

  return hexRoot === hashBuf.toString('hex');
};

class MerkleProofTree extends MerkleTree {
  constructor(data) {
    super(data, sha256, { hashLeaves: true, sort: true });
  }

  getHexProof(leaf, index) {
    return super.getHexProof(leaf, index).map((x) => x.substring(2));
  }

  getHexRoot() {
    return super.getHexRoot().substring(2);
  }
}

const tree = new MerkleProofTree(
  data.map(({ address, amount }) => address + amount)
);

// add item to tree then verify
const itemData = {
  address: 'wasm1k9hwzxs889jpvd7env8z49gad3a3633vg350tq',
  amount: '666666666'
};

tree.addLeaf(itemData.address + itemData.amount);
const proofItem = {
  ...itemData,
  root: tree.getHexRoot()
};
const hexLeaf = sha256(proofItem.address + proofItem.amount).toString('hex');
proofItem.proofs = tree.getHexProof(hexLeaf);

console.log('proofItem', proofItem);
const verified = verifyHexProof(hexLeaf, proofItem.proofs, proofItem.root);
console.log('verified', verified);
