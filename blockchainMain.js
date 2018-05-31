var SHA256 = require('crypto-js/sha256');
    
class Transaction {
    constructor (fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress  = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor (timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;     // Random number that is the only thing that can change in the block
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        
        // Array(difficulty +1).join("0") creates a String with (difficult+1) amount of zeros
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))  { // if difficulty is 5 -> this gets the first 5 chars of the hash
            this.hash = this.calculateHash();
            this.nonce++;
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;    // set Difficulty
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(new Date(1990, 6), "Genesis block", "0");
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransaction (miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);    // normally you wouldnt pend all Transactions and miners choose which to include and which not
        block.mineBlock(this.difficulty);

        console.log("Block Successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction (transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress (address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
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

bChain.createTransaction(new Transaction('Address1', 'Address2', 4));
bChain.createTransaction(new Transaction('Address2', 'Address1', 5));

console.log("\n Starting Mining ... ");
bChain.minePendingTransaction("my Address");

console.log("\n Balance of my Account is ", bChain.getBalanceOfAddress("my Address"));

console.log("\n Starting the Mining again ...");
bChain.minePendingTransaction("my Address");

console.log("\n Balance of my Account is ", bChain.getBalanceOfAddress("my Address"));