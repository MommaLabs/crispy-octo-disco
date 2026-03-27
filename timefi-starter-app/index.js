const { TimeFiClient, formatSTX } = require("timefi-sdk");
const { StacksClickerSDK } = require("stacks-clicker-sdk");
const { MinimintClient } = require("stacksminimint-sdk");
const { createChainstampClient } = require("@bamzzstudio/chainstamps-sdk");

const NETWORK = process.env.STACKS_NETWORK || "mainnet";
const MINIMINT_CONTRACT_NAME = process.env.MINIMINT_CONTRACT_NAME || "minimint-core-v-i27";
const CLICKER_NETWORK = NETWORK === "testnet" ? "testnet" : "mainnet";

async function runStarterIntegration() {
  const timefi = new TimeFiClient(NETWORK);
  const minimint = new MinimintClient(NETWORK);
  minimint.contractName = MINIMINT_CONTRACT_NAME;
  const chainstamp = createChainstampClient({ network: NETWORK });
  const clicker = new StacksClickerSDK({ network: CLICKER_NETWORK });
  let successfulCalls = 0;

  console.log("Starter app using real SDK integration");
  console.log(`Network: ${NETWORK}`);
  console.log(`Using minimint contract: ${minimint.contractAddress}.${minimint.contractName}`);

  try {
    const tvl = await timefi.getTVL();
    console.log(`TimeFi TVL: ${formatSTX(tvl)} STX`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("TimeFi read call failed:", error?.message || error);
  }

  try {
    const lastTokenId = await minimint.getLastTokenId();
    console.log(`StacksMinimint last token id: ${lastTokenId}`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("StacksMinimint read call failed:", error?.message || error);
  }

  try {
    const clickPayload = clicker.click();
    const tipPayload = clicker.tip("1000");
    const votePayload = clicker.vote(1, 1);
    console.log(`StacksClicker contract: ${clickPayload.contractAddress}.${clickPayload.contractName}`);
    console.log(`StacksClicker tip args: ${tipPayload.functionArgs.length}`);
    console.log(`StacksClicker vote args: ${votePayload.functionArgs.length}`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("StacksClicker SDK call failed:", error?.message || error);
  }

  try {
    const hashCount = await chainstamp.getHashCount();
    console.log(`Chainstamp total hashes: ${hashCount.value}`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("Chainstamp read call failed:", error?.message || error);
  }

  if (successfulCalls === 0) {
    throw new Error("No live SDK calls succeeded.");
  }
}

runStarterIntegration().catch(error => {
  console.error("Starter integration failed:", error?.message || error);
  process.exitCode = 1;
});
