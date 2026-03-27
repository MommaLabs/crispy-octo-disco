const { TimeFiClient, formatSTX } = require("timefi-sdk");
const { StacksClickerSDK } = require("stacks-clicker-sdk");
const { MinimintClient, getTokenExplorerUrl } = require("stacksminimint-sdk");
const { createChainstampClient } = require("@bamzzstudio/chainstamps-sdk");

const NETWORK = process.env.STACKS_NETWORK || "mainnet";
const MINIMINT_CONTRACT_NAME = process.env.MINIMINT_CONTRACT_NAME || "minimint-core-v-i27";
const CLICKER_NETWORK = NETWORK === "testnet" ? "testnet" : "mainnet";

async function runGrowthBot() {
  console.log("Growth Bot active");
  console.log(`Network: ${NETWORK}`);

  const timefi = new TimeFiClient(NETWORK);
  const minimint = new MinimintClient(NETWORK);
  minimint.contractName = MINIMINT_CONTRACT_NAME;
  const chainstamp = createChainstampClient({ network: NETWORK });
  const clicker = new StacksClickerSDK({ network: CLICKER_NETWORK });
  let successfulCalls = 0;

  console.log("\nVerifying TimeFi SDK...");
  try {
    const tvl = await timefi.getTVL();
    console.log(`TimeFi TVL (formatted): ${formatSTX(tvl)} STX`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("TimeFi read call failed:", error?.message || error);
  }

  console.log("\nVerifying StacksMinimint SDK...");
  console.log(`Using contract: ${minimint.contractAddress}.${minimint.contractName}`);
  try {
    const lastTokenId = await minimint.getLastTokenId();
    console.log(`Last minted token id: ${lastTokenId}`);
    console.log(`Explorer URL: ${getTokenExplorerUrl(String(lastTokenId), NETWORK)}`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("StacksMinimint read call failed:", error?.message || error);
  }

  console.log("\nVerifying StacksClicker SDK...");
  try {
    const clickPayload = clicker.multiClick(3);
    const tipPayload = clicker.tip("1000");
    const votePayload = clicker.vote(1, 1);

    console.log(
      `Clicker payload: ${clickPayload.contractAddress}.${clickPayload.contractName}::${clickPayload.functionName}`
    );
    console.log(`Tip payload args: ${tipPayload.functionArgs.length}`);
    console.log(`Vote payload args: ${votePayload.functionArgs.length}`);
    successfulCalls += 1;
  } catch (error) {
    console.warn("StacksClicker SDK call failed:", error?.message || error);
  }

  console.log("\nVerifying Chainstamp SDK...");
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

  console.log("\nSDK integration check completed successfully.");
}

runGrowthBot().catch(error => {
  console.error("SDK integration check failed:", error?.message || error);
  process.exitCode = 1;
});
