// this program is for sending sol form sender to receiver 

// theory : transaction krne ke liye instruction banana padta hai 

import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  Connection
} from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const sender = new Keypair();   // this creates a pair of public and private key for sender
const receiver = new Keypair();  // this creates a pair of public and private key for receiver

// this is to add some funds to sender if not have any 
const signature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction(signature, "confirmed");

// yaha pr transaction ka instruction bana hai
const Instruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: 0.01 * LAMPORTS_PER_SOL
});

// the above transcation is now added to the transaction 
const transaction = new Transaction().add(Instruction);

// then the transaction is being signed by the private key of the sender for authorization and then sent to the vaslidators 
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [sender]
);

console.log("Transaction Signature:", `${transactionSignature}`);

const senderBalance = await connection.getBalance(sender.publicKey);
const receiverBalance = await connection.getBalance(receiver.publicKey);

console.log("Sender Balance:", `${senderBalance}`);
console.log("Receiver Balance:", `${receiverBalance}`);