const { MerkleTree } = require('../helpers/merkleTree.js');
const { sha3, bufferToHex } = require('ethereumjs-util');

const MerkleProofWrapper = artifacts.require('MerkleProofWrapper');

require('chai')
  .should();

contract('MerkleProof', function () {
  let merkleProof;

  beforeEach(async function () {
    merkleProof = await MerkleProofWrapper.new();
  });

  describe('verifyProof', function () {
    it('should return true for a valid Merkle proof', async function () {
      const elements = ['a', 'b', 'c', 'd'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);

      const leaf = bufferToHex(sha3(elements[0]));

      const result = await merkleProof.verifyProof(proof, root, leaf);
      result.should.be.true;
    });

    it('should return false for an invalid Merkle proof', async function () {
      const correctElements = ['a', 'b', 'c'];
      const correctMerkleTree = new MerkleTree(correctElements);

      const correctRoot = correctMerkleTree.getHexRoot();

      const correctLeaf = bufferToHex(sha3(correctElements[0]));

      const badElements = ['d', 'e', 'f'];
      const badMerkleTree = new MerkleTree(badElements);

      const badProof = badMerkleTree.getHexProof(badElements[0]);

      const result = await merkleProof.verifyProof(badProof, correctRoot, correctLeaf);
      result.should.be.false;
    });

    it('should return false for a Merkle proof of invalid length', async function () {
      const elements = ['a', 'b', 'c'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);
      const badProof = proof.slice(0, proof.length - 5);

      const leaf = bufferToHex(sha3(elements[0]));

      const result = await merkleProof.verifyProof(badProof, root, leaf);
      result.should.be.false;
    });
  });
});
