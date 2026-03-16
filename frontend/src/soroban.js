import { rpc, TransactionBuilder, Networks, xdr, scValToNative, nativeToScVal, Contract, Address, Account } from '@stellar/stellar-sdk';
import { isConnected, getAddress, signTransaction, setAllowed } from '@stellar/freighter-api';

const SERVER_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = 'CAMP4KWUOXJOHCGPMUNPMEHAJOKSRM6NZ2CBSFST5Z6HDYLKHBV2BQN4';

const server = new rpc.Server(SERVER_URL);
const contract = new Contract(CONTRACT_ID);

export async function connectWallet() {
  if (await isConnected()) {
    // Attempt to set allowed first (this requests the user to share their address)
    await setAllowed();
    
    const response = await getAddress();
    console.log("Freighter getAddress response:", response);
    
    // Freighter can return a string or an object with an 'address' field
    const address = typeof response === 'string' ? response : response.address;
    if (!address) {
      console.error("Failed to retrieve address. Response was:", response);
      throw new Error("Could not retrieve address from Freighter. Please ensure your account is public.");
    }
    return address;
  }
  throw new Error("Freighter not connected or not installed. Please install Freighter Extension.");
}

async function getAccount(publicKey) {
  return await server.getAccount(publicKey);
}

// Function to invoke the smart contract
export async function invokeContract(method, args, publicKey) {
  try {
    const account = await getAccount(publicKey);
    
    // Build the transaction
    const tx = new TransactionBuilder(account, { fee: "100" })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .setNetworkPassphrase(NETWORK_PASSPHRASE)
      .build();

    // Prepare transaction for Soroban
    const preparedTx = await server.prepareTransaction(tx);
    
    // Sign the transaction utilizing Freighter
    const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    
    // Send to Soroban
    const sendResponse = await server.sendTransaction(signedTx);
    
    if (sendResponse.status === "PENDING") {
      let txResponse = await server.getTransaction(sendResponse.hash);
      
      // Poll for transaction outcome
      while (txResponse.status === "NOT_FOUND") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        txResponse = await server.getTransaction(sendResponse.hash);
      }
      
      if (txResponse.status === "SUCCESS") {
        if (!txResponse.resultMetaXdr) {
          return true; // some transactions don't have return values, just success
        }
        const resultMeta = xdr.TransactionMeta.fromXDR(txResponse.resultMetaXdr, "base64");
        // Simple extraction strategy (can be deeper depending on exact response format)
        // Usually, the return value is in resultMeta.v3().sorobanMeta().returnValue()
        try {
          const resultVal = resultMeta.v3().sorobanMeta().returnValue();
          return scValToNative(resultVal);
        } catch (e) {
          console.warn("Could not extract return value. Showing transaction status as success.");
          return true; 
        }
      } else {
        throw new Error(`Transaction failed: ${txResponse.status}`);
      }
    } else {
      throw new Error(`Failed to send transaction: ${sendResponse.status}`);
    }
  } catch (error) {
    console.error("Error invoking contract:", error);
    throw error;
  }
}

// Helper to simulate a read-only request (like get_question)
export async function readContract(method, args, publicKey) {
  try {
    const tx = new TransactionBuilder(new Account(publicKey, "0"), { fee: "100" })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .setNetworkPassphrase(NETWORK_PASSPHRASE)
      .build();

    const response = await server.simulateTransaction(tx);
    
    if (!response.result) {
      throw new Error("No result returned from simulation.");
    }
    const resultVal = xdr.ScVal.fromXDR(response.result.retval, "base64");
    return scValToNative(resultVal);
  } catch (error) {
    console.error("Error reading from contract:", error);
    throw error;
  }
}

// ------------------------------------------------------------------
// Specific Methods for our Quiz Contract
// 1. add_question(env: Env, id: u32, question: String, answer: String)
// ------------------------------------------------------------------
export async function addQuestion(publicKey, id, questionTxt, answerTxt) {
  const args = [
    nativeToScVal(Number(id), { type: "u32" }),
    nativeToScVal(questionTxt, { type: "string" }),
    nativeToScVal(answerTxt, { type: "string" })
  ];
  return await invokeContract("add_question", args, publicKey);
}

// ------------------------------------------------------------------
// 2. get_question(env: Env, id: u32) -> Question
// ------------------------------------------------------------------
export async function getQuestion(id) {
  // Use a dummy public key for simulation if wallet not connected, or require it
  // For Soroban testnet simulate, a dummy formatted string is sometimes okay, 
  // but let's just ask users to pass a pubkey or use a known one.
  const DUMMY_PUBKEY = "GCY36TUZU4KOTUKZZGEPXV6U7HYG3L5NYI3MBZ4R7V4E2M3K4JMWZJ2G"; 
  const args = [
    nativeToScVal(Number(id), { type: "u32" })
  ];
  try {
    const rawVal = await readContract("get_question", args, DUMMY_PUBKEY);
    // Question is a struct: { id: u32, question: String, answer: String }
    // which scValToNative might parse as an array/Map or Object.
    return parseQuestion(rawVal);
  } catch (err) {
    console.error("getQuestion error:", err);
    throw err;
  }
}

// ------------------------------------------------------------------
// 3. check_answer(env: Env, id: u32, user_answer: String) -> bool
// ------------------------------------------------------------------
export async function checkAnswer(publicKey, id, userAnswer) {
  const args = [
    nativeToScVal(Number(id), { type: "u32" }),
    nativeToScVal(userAnswer, { type: "string" })
  ];
  // Can either invoke to blockchain or simulate if we just want to verify.
  // The Rust code doesn't mutate state on check_answer. 
  // So simulateTransaction (readContract) is cheaper and faster.
  return await readContract("check_answer", args, publicKey || "GCY36TUZU4KOTUKZZGEPXV6U7HYG3L5NYI3MBZ4R7V4E2M3K4JMWZJ2G");
}

function parseQuestion(rawStruct) {
  if (Array.isArray(rawStruct)) {
    // some struct parsing rules depending on SDK version returns map/array
    let obj = {};
    rawStruct.forEach(item => { /* custom extraction if needed */ });
    return rawStruct; // depends on actual output
  }
  return rawStruct; // usually scValToNative returns an object for structs if symbols are matched
}
