var SHA256 = require('crypto-js/sha256');
	
class Block {
    constructor (index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date(1990, 6), "Genesis block", "0");
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid () {
        for (var i = 1; i < this.chain.length; i++) {
            
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                // checks if the hash is different than the calculated one, if so it has been modified
                return false;
            } 
            if (currentBlock.previousHash !== previousBlock.hash) {
                // checks if our block points to the right previous Block, if someone were to calculate all new Hashes
                return false;
            }
        }
        return true;
    }
}

var bChain = new Blockchain();

bChain.addBlock(new Block(1, new Date(1990, 5), 30));
bChain.addBlock(new Block(2, new Date(1990, 6), 40));

console.log("is valid? " + bChain.isChainValid());

bChain.chain[1].data = 500;
bChain.chain[1].hash = bChain.chain[1].calculateHash();

console.log("is valid?" + bChain.isChainValid());