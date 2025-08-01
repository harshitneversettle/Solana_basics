import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  getMint
} from "@solana/spl-token";

// this is a connection to connect with rpc server
const connection = new Connection("http://localhost:8899", "confirmed");

// a new public private keypair for wallet 
const wallet = new Keypair();

// Fund the wallet with SOL
const signature = await connection.requestAirdrop(
  wallet.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction(signature, "confirmed");

// Generate keypair to use as address of mint account
const mint = new Keypair();

// Calculate lamports required for rent exemption
const rentExemptionLamports =
  await getMinimumBalanceForRentExemptMint(connection);

// Instruction to create new account with space for new mint account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: rentExemptionLamports,
  programId: TOKEN_2022_PROGRAM_ID
});

// Instruction to initialize mint account
const initializeMintInstruction = createInitializeMint2Instruction(
  mint.publicKey,
  2, // decimals  // means kitne subparts me token divide ho sakega => 1$ == 100 cents toh dollar ka decimal 2 
  wallet.publicKey, // mint authority  // mint ki authority wallet ke paas hogi 
  wallet.publicKey, // freeze authority  wallet hi token freeze kr payega 
  TOKEN_2022_PROGRAM_ID
);

// Build transaction with instructions to create new account and initialize mint account
// jo instruction hain unko ab transaction me daal denge 
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintInstruction
);

// ab transzction wallet ki private key se sign hoga and then validators ke paas pass on ho jayega 
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [
    wallet, // payer
    mint // mint address keypair
  ]
);

console.log("Transaction Signature:", `${transactionSignature}`);

const mintData = await getMint(
  connection,
  mint.publicKey,
  "confirmed",
  TOKEN_2022_PROGRAM_ID
);
console.log(
  "Mint Account:",
  JSON.stringify(
    mintData,
    (key, value) => {
      // Convert BigInt to String
      if (typeof value === "bigint") {
        return value.toString();
      }
      // Handle Buffer objects
      if (Buffer.isBuffer(value)) {
        return `<Buffer ${value.toString("hex")}>`;
      }
      return value;
    },
    2
  )
);