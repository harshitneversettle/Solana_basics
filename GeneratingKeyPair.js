import { generateKeyPairSigner } from "@solana/kit";

// Kit does not enable extractable private keys
const keypairSigner = await generateKeyPairSigner();
console.log(keypairSigner);